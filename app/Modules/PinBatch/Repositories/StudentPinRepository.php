<?php

namespace App\Modules\PinBatch\Repositories;

use App\Models\StudentPin;
use Illuminate\Support\Str;

class StudentPinRepository
{
    /**
     * Ambil semua PIN dalam satu batch beserta info siswa & screening (termasuk sdq_result untuk rekap).
     */
    public function getByBatch(string $batchId)
    {
        return StudentPin::with([
            'subject:id,name,nis,class_id',
            'subject.class:id,class_name',
            'screening:id,subject_id,reporter_user_id,instrument_id,type_id,pin_id,date_taken,status',
            'screening.subject:id,name',
            'screening.reporter:id,name,role',
            'screening.instrument:id,name',
            'screening.instrumentType:id,type_name',
            'screening.sdqResult',
            'screening.srqResult',
        ])
            ->where('batch_id', $batchId)
            ->get();
    }

    public function getActivePinsByStudent(string $subjectId)
    {
        return StudentPin::with([
            'batch:id,label,expires_at,status,instrument_id',
            'batch.instrument:id,name',
        ])
            ->where('subject_id', $subjectId)
            ->whereNull('used_at')
            ->get();
    }

    public function findByCodeAndSubject(string $pinCode, string $subjectId): ?StudentPin
    {
        return StudentPin::with('batch')
            ->where('pin_code', $pinCode)
            ->where('subject_id', $subjectId)
            ->first();
    }

    /**
     * Buat banyak PIN sekaligus untuk satu batch.
     *
     * @param  array<string>  $subjectIds  UUID Subject (data siswa)
     */
    public function insertForBatch(string $batchId, array $subjectIds): void
    {
        $rows = array_map(function (string $subjectId) use ($batchId) {
            return [
                'id' => (string) Str::uuid(),
                'batch_id' => $batchId,
                'subject_id' => $subjectId,
                'pin_code' => $this->generateUniquePin(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $subjectIds);

        foreach (array_chunk($rows, 100) as $chunk) {
            StudentPin::insert($chunk);
        }
    }

    /**
     * Tandai PIN sebagai terpakai dan kaitkan ke screening.
     */
    public function markUsed(StudentPin $pin, string $screeningId): StudentPin
    {
        $pin->update([
            'used_at' => now(),
            'screening_id' => $screeningId,
        ]);

        return $pin;
    }

    /**
     * Hapus PIN lama siswa dalam batch (untuk regenerate).
     */
    public function deleteByBatchAndSubject(string $batchId, string $subjectId): void
    {
        StudentPin::where('batch_id', $batchId)
            ->where('subject_id', $subjectId)
            ->delete();
    }

    /**
     * Generate PIN 8 karakter alfanumerik huruf besar yang unik di tabel.
     */
    private function generateUniquePin(): string
    {
        do {
            $pin = strtoupper(Str::random(8));
        } while (StudentPin::where('pin_code', $pin)->exists());

        return $pin;
    }
}
