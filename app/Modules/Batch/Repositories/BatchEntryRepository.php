<?php

namespace App\Modules\Batch\Repositories;

use App\Models\BatchEntry;

class BatchEntryRepository
{
    public function getByBatch(string $batchId)
    {
        return BatchEntry::with([
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

    public function findByBatchAndSubject(string $batchId, string $subjectId): ?BatchEntry
    {
        return BatchEntry::where('batch_id', $batchId)
            ->where('subject_id', $subjectId)
            ->first();
    }

    public function markUsed(string $batchId, string $subjectId, string $screeningId): BatchEntry
    {
        return BatchEntry::create([
            'batch_id' => $batchId,
            'subject_id' => $subjectId,
            'used_at' => now(),
            'screening_id' => $screeningId,
        ]);
    }
}
