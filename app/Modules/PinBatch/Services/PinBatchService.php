<?php

namespace App\Modules\PinBatch\Services;

use App\Models\Clazz;
use App\Models\PinBatch;
use App\Models\StudentPin;
use App\Modules\PinBatch\Repositories\PinBatchRepository;
use App\Modules\PinBatch\Repositories\StudentPinRepository;
use DomainException;
use Illuminate\Support\Facades\DB;

class PinBatchService
{
    public function __construct(
        protected PinBatchRepository $batchRepo,
        protected StudentPinRepository $pinRepo
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

    public function getPinsForBatch(string $batchId)
    {
        return $this->pinRepo->getByBatch($batchId);
    }

    public function getActivePinsForStudent(string $studentUserId)
    {
        return $this->pinRepo->getActivePinsByStudent($studentUserId);
    }

    /**
     * Buat PIN Batch baru dan generate PIN untuk semua siswa di kelas.
     *
     * @throws DomainException
     */
    public function createBatch(array $data, string $schoolUserId): PinBatch
    {
        $allClasses = $data['class_id'] === 'all';

        if ($allClasses) {
            $classes = Clazz::where('school_user_id', $schoolUserId)->get();

            if ($classes->isEmpty()) {
                throw new DomainException('Belum ada kelas. Buat kelas dan import siswa terlebih dahulu.');
            }

            $classIds = $classes->pluck('id')->toArray();

            $subjectIds = \App\Models\Subject::whereIn('class_id', $classIds)
                ->where('owner_user_id', $schoolUserId)
                ->pluck('id')
                ->toArray();

            if (empty($subjectIds)) {
                throw new DomainException('Tidak ada siswa di semua kelas. Import siswa terlebih dahulu.');
            }

            // Untuk batch lintas kelas, class_id disimpan null
            return DB::transaction(function () use ($data, $schoolUserId, $subjectIds) {
                $batch = $this->batchRepo->create([
                    'school_user_id' => $schoolUserId,
                    'class_id' => null,   // lintas kelas
                    'instrument_id' => $data['instrument_id'],
                    'label' => $data['label'],
                    'expires_at' => $data['expires_at'] ?? null,
                    'status' => 'active',
                ]);

                $this->pinRepo->insertForBatch($batch->id, $subjectIds);

                return $batch;
            });
        }

        $class = Clazz::findOrFail($data['class_id']);

        if ($class->school_user_id !== $schoolUserId) {
            throw new DomainException('Kelas tidak ditemukan atau bukan milik Anda.');
        }

        $subjectIds = \App\Models\Subject::where('class_id', $class->id)
            ->where('owner_user_id', $schoolUserId)
            ->pluck('id')
            ->toArray();

        if (empty($subjectIds)) {
            throw new DomainException('Tidak ada siswa di kelas ini. Import siswa terlebih dahulu.');
        }

        return DB::transaction(function () use ($data, $schoolUserId, $subjectIds, $class) {
            $batch = $this->batchRepo->create([
                'school_user_id' => $schoolUserId,
                'class_id' => $class->id,
                'instrument_id' => $data['instrument_id'],
                'label' => $data['label'],
                'expires_at' => $data['expires_at'] ?? null,
                'status' => 'active',
            ]);

            $this->pinRepo->insertForBatch($batch->id, $subjectIds);

            return $batch;
        });
    }

    /**
     * Tutup batch (tidak bisa dipakai oleh siswa lagi).
     *
     * @throws DomainException
     */
    public function closeBatch(string $batchId, string $schoolUserId): PinBatch
    {
        $batch = $this->batchRepo->findOrFail($batchId);

        $this->authorizeSchool($batch, $schoolUserId);

        if ($batch->status === 'closed') {
            throw new DomainException('Batch sudah dalam status tertutup.');
        }

        return $this->batchRepo->update($batch, ['status' => 'closed']);
    }

    /**
     * Assign psikolog ke batch sehingga psikolog bisa menganalisis hasil.
     *
     * @throws DomainException
     */
    public function assignPsychologist(string $batchId, string $psychologistId, string $schoolUserId): PinBatch
    {
        $batch = $this->batchRepo->findOrFail($batchId);

        $this->authorizeSchool($batch, $schoolUserId);

        return $this->batchRepo->update($batch, [
            'assigned_psychologist_id' => $psychologistId,
        ]);
    }

    /**
     * Regenerate PIN untuk satu siswa dalam batch
     * (PIN lama dihapus, PIN baru di-generate).
     *
     * @throws DomainException
     */
    public function regeneratePin(string $batchId, string $pinId, string $schoolUserId): StudentPin
    {
        $batch = $this->batchRepo->findOrFail($batchId);

        $this->authorizeSchool($batch, $schoolUserId);

        $pin = StudentPin::where('id', $pinId)
            ->where('batch_id', $batchId)
            ->firstOrFail();

        if ($pin->isUsed()) {
            throw new DomainException('PIN yang sudah digunakan tidak dapat di-regenerate.');
        }

        return DB::transaction(function () use ($pin) {
            $subjectId = $pin->subject_id;
            $batchId = $pin->batch_id;

            $pin->delete();

            $this->pinRepo->insertForBatch($batchId, [$subjectId]);

            return StudentPin::where('batch_id', $batchId)
                ->where('subject_id', $subjectId)
                ->latest()
                ->firstOrFail();
        });
    }

    /** Pastikan batch memang milik Guru BK yang bersangkutan. */
    private function authorizeSchool(PinBatch $batch, string $schoolUserId): void
    {
        if ($batch->school_user_id !== $schoolUserId) {
            throw new DomainException('Anda tidak memiliki akses ke batch ini.');
        }
    }
}
