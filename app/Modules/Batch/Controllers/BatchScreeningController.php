<?php

namespace App\Modules\Batch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PinBatch;
use App\Models\Screening;
use Inertia\Inertia;

class BatchScreeningController extends Controller
{
    public function show(string $batchId, string $screeningId)
    {
        $user = auth()->user();

        $batch = PinBatch::where('id', $batchId)
            ->where('assigned_psychologist_id', $user->id)
            ->firstOrFail();

        $screening = Screening::with([
            'subject:id,name,age,gender',
            'reporter:id,name,role',
            'instrument:id,name',
            'instrumentType:id,type_name,min_age,max_age',
            'sdqResult.psychologist:id,name',
            'srqResult.psychologist:id,name',
            'batchEntry:id,batch_id',
        ])
            ->where('id', $screeningId)
            ->whereHas('batchEntry', fn ($q) => $q->where('batch_id', $batchId))
            ->firstOrFail();

        return Inertia::render('Dashboard/Psychologist/Batch/ScreeningDetail', [
            'batch' => [
                'id' => $batch->id,
                'label' => $batch->label,
            ],
            'screening' => $screening,
        ]);
    }
}
