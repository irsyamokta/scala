<?php

namespace App\Modules\PinBatch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PinBatch;
use App\Models\Screening;
use Inertia\Inertia;

/**
 * Psikolog mengakses detail screening individual dalam konteks sebuah batch.
 * Ini adalah halaman di mana psikolog membaca hasil dan mengisi catatan/rekomendasi.
 */
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
            'studentPin:id,pin_code,batch_id',
        ])
            ->where('id', $screeningId)
            ->whereHas('studentPin', fn ($q) => $q->where('batch_id', $batchId))
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
