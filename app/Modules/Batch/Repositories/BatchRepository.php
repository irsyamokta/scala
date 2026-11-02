<?php

namespace App\Modules\Batch\Repositories;

use App\Models\Batch;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class BatchRepository
{
    public function getPaginatedBySchool(string $schoolUserId, int $perPage = 10)
    {
        // Auto-close batch expired sebelum query agar status tampil akurat
        Batch::where('school_user_id', $schoolUserId)
            ->where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->update(['status' => 'closed']);

        return Batch::with([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
        ])
            ->where('school_user_id', $schoolUserId)
            ->withCount(['entries as tested_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->addSelect($this->totalSubjectsSubquery())
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getPaginatedByPsychologist(string $psychologistId, int $perPage = 10)
    {
        return Batch::with([
            'class:id,class_name',
            'instrument:id,name',
            'school:id,name,school_name',
        ])
            ->where('assigned_psychologist_id', $psychologistId)
            ->withCount(['entries as tested_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->addSelect($this->totalSubjectsSubquery())
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findOrFail(string $id): Batch
    {
        $batch = Batch::with([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
            'school:id,name,school_name',
        ])->findOrFail($id);

        $batch->autoCloseIfExpired();

        return $batch->fresh([
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
            'school:id,name,school_name',
        ]);
    }

    public function create(array $data): Batch
    {
        return Batch::create($data);
    }

    public function update(Batch $batch, array $data): Batch
    {
        $batch->update($data);

        return $batch;
    }

    /**
     * Untuk batch lintas kelas (class_id null), ambil dari semua kelas milik school.
     */
    public function getParticipants(string $batchId)
    {
        $batch = Batch::findOrFail($batchId);

        $query = Subject::with([
            'class:id,class_name',
            'batchEntries' => fn ($q) => $q->where('batch_id', $batchId)
                ->with([
                    'screening:id,subject_id,reporter_user_id,instrument_id,type_id,date_taken,status',
                    'screening.subject:id,name',
                    'screening.reporter:id,name,role',
                    'screening.instrument:id,name',
                    'screening.instrumentType:id,type_name',
                    'screening.sdqResult',
                    'screening.srqResult',
                ]),
        ])
            ->where('owner_user_id', $batch->school_user_id)
            ->where('is_self', false);

        if ($batch->class_id) {
            $query->where('class_id', $batch->class_id);
        }

        return $query->orderBy('name')->get();
    }

    public function findByToken(string $token): ?Batch
    {
        $batch = Batch::with([
            'class:id,class_name',
            'instrument:id,name',
        ])->where('access_token', $token)->first();

        if ($batch) {
            $batch->autoCloseIfExpired();

            return $batch->fresh(['class:id,class_name', 'instrument:id,name']);
        }

        return null;
    }

    private function totalSubjectsSubquery()
    {
        return DB::raw('(
            SELECT count(*) FROM subjects
            WHERE subjects.owner_user_id = batches.school_user_id
            AND subjects.is_self = 0
            AND (subjects.class_id = batches.class_id OR batches.class_id IS NULL)
        ) as total_subjects');
    }
}
