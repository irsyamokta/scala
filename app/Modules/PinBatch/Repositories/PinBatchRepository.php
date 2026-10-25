<?php

namespace App\Modules\PinBatch\Repositories;

use App\Models\PinBatch;

class PinBatchRepository
{
    /**
     * Ambil semua batch milik Guru BK tertentu dengan pagination.
     */
    public function getPaginatedBySchool(string $schoolUserId, int $perPage = 10)
    {
        // Auto-close semua batch expired milik sekolah ini sebelum query
        PinBatch::where('school_user_id', $schoolUserId)
            ->where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->update(['status' => 'closed']);

        return PinBatch::with([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
        ])
            ->where('school_user_id', $schoolUserId)
            ->withCount('studentPins')
            ->withCount(['studentPins as used_pins_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Ambil semua batch yang di-assign ke psikolog tertentu.
     */
    public function getPaginatedByPsychologist(string $psychologistId, int $perPage = 10)
    {
        return PinBatch::with([
            'class:id,class_name',
            'instrument:id,name',
            'school:id,name',
        ])
            ->where('assigned_psychologist_id', $psychologistId)
            ->withCount('studentPins')
            ->withCount(['studentPins as used_pins_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findOrFail(string $id): PinBatch
    {
        $batch = PinBatch::with([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
            'school:id,name',
        ])
            ->findOrFail($id);

        // Auto-close jika sudah expired
        $batch->autoCloseIfExpired();

        return $batch->fresh([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
            'school:id,name',
        ]);
    }

    public function create(array $data): PinBatch
    {
        return PinBatch::create($data);
    }

    public function update(PinBatch $batch, array $data): PinBatch
    {
        $batch->update($data);

        return $batch;
    }
}
