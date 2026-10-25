<?php

namespace App\Modules\Batch\Services;

use App\Models\Clazz;
use App\Models\PinBatch;
use App\Models\Subject;
use App\Modules\Batch\Repositories\BatchRepository;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BatchService
{
    public function __construct(
        protected BatchRepository $batchRepo
    ) {}

    public function getBatchesForSchool(string $schoolUserId, int $perPage = 10)
    {
        return $this->batchRepo->getPaginatedBySchool($schoolUserId, $perPage);
    }

    public function getBatchesForPsychologist(string $psychologistId, int $perPage = 10)
    {
        return $this->batchRepo->getPaginatedByPsychologist($psychologistId, $perPage);
    }

    public function getBatchDetail(string $batchId): PinBatch
    {
        return $this->batchRepo->findOrFail($batchId);
    }

    public function getParticipantsForBatch(string $batchId)
    {
        return $this->batchRepo->getParticipants($batchId);
    }

    /** Satu batch = satu link akses unik. Siswa tes via link/QR tanpa PIN individual. */
    public function createBatch(array $data, string $schoolUserId): PinBatch
    {
        $allClasses = $data['class_id'] === 'all';

        if ($allClasses) {
            $classes = Clazz::where('school_user_id', $schoolUserId)->get();

            if ($classes->isEmpty()) {
                throw new DomainException('Belum ada kelas. Buat kelas dan import siswa terlebih dahulu.');
            }

            $classIds = $classes->pluck('id')->toArray();

            $hasStudents = Subject::whereIn('class_id', $classIds)
                ->where('owner_user_id', $schoolUserId)
                ->exists();

            if (! $hasStudents) {
                throw new DomainException('Tidak ada siswa di semua kelas. Import siswa terlebih dahulu.');
            }

            return DB::transaction(function () use ($data, $schoolUserId) {
                return $this->batchRepo->create([
                    'school_user_id' => $schoolUserId,
                    'class_id' => null,
                    'instrument_id' => $data['instrument_id'],
                    'label' => $data['label'],
                    'access_token' => $this->generateUniqueToken(),
                    'expires_at' => $data['expires_at'] ?? null,
                    'status' => 'active',
                ]);
            });
        }

        $class = Clazz::findOrFail($data['class_id']);

        if ($class->school_user_id !== $schoolUserId) {
            throw new DomainException('Kelas tidak ditemukan atau bukan milik Anda.');
        }

        $hasStudents = Subject::where('class_id', $class->id)
            ->where('owner_user_id', $schoolUserId)
            ->exists();

        if (! $hasStudents) {
            throw new DomainException('Tidak ada siswa di kelas ini. Import siswa terlebih dahulu.');
        }

        return DB::transaction(function () use ($data, $schoolUserId, $class) {
            return $this->batchRepo->create([
                'school_user_id' => $schoolUserId,
                'class_id' => $class->id,
                'instrument_id' => $data['instrument_id'],
                'label' => $data['label'],
                'access_token' => $this->generateUniqueToken(),
                'expires_at' => $data['expires_at'] ?? null,
                'status' => 'active',
            ]);
        });
    }

    public function closeBatch(string $batchId, string $schoolUserId): PinBatch
    {
        $batch = $this->batchRepo->findOrFail($batchId);

        $this->authorizeSchool($batch, $schoolUserId);

        if ($batch->status === 'closed') {
            throw new DomainException('Batch sudah dalam status tertutup.');
        }

        return $this->batchRepo->update($batch, ['status' => 'closed']);
    }

    public function assignPsychologist(string $batchId, string $psychologistId, string $schoolUserId): PinBatch
    {
        $batch = $this->batchRepo->findOrFail($batchId);

        $this->authorizeSchool($batch, $schoolUserId);

        return $this->batchRepo->update($batch, [
            'assigned_psychologist_id' => $psychologistId,
        ]);
    }

    /** Pastikan batch memang milik Guru BK yang bersangkutan. */
    private function authorizeSchool(PinBatch $batch, string $schoolUserId): void
    {
        if ($batch->school_user_id !== $schoolUserId) {
            throw new DomainException('Anda tidak memiliki akses ke batch ini.');
        }
    }

    private function generateUniqueToken(): string
    {
        do {
            $token = strtoupper(Str::random(12));
        } while (PinBatch::where('access_token', $token)->exists());

        return $token;
    }
}
