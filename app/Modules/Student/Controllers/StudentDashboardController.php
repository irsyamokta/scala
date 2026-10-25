<?php

namespace App\Modules\Student\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Screening;
use App\Models\StudentPin;
use App\Models\Subject;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $subjectIds = Subject::where('owner_user_id', $user->id)->pluck('id');

        $activePins = StudentPin::with([
            'batch:id,label,instrument_id,expires_at,status',
            'batch.instrument:id,name',
            'subject:id,name',
        ])
            ->whereIn('subject_id', $subjectIds)
            ->whereNull('used_at')
            ->whereHas('batch', fn ($q) => $q->where('status', 'active'))
            ->get(['id', 'pin_code', 'batch_id', 'subject_id', 'created_at']);

        $screeningHistory = Screening::with([
            'instrument:id,name',
            'instrumentType:id,type_name',
            'sdqResult:id,screening_id,overall_category,total_difficulties,recommendation,date_analysis',
            'studentPin:id,pin_code,batch_id,subject_id',
            'studentPin.batch:id,label',
            'studentPin.subject:id,name',
        ])
            ->whereHas('studentPin', fn ($q) => $q->whereIn('subject_id', $subjectIds))
            ->latest('date_taken')
            ->get(['id', 'instrument_id', 'type_id', 'pin_id', 'date_taken', 'status']);

        return Inertia::render('Dashboard/Student/Index', [
            'active_pins' => $activePins,
            'screening_history' => $screeningHistory,
        ]);
    }

    public function result(string $screeningId)
    {
        $user = auth()->user();

        $subjectIds = Subject::where('owner_user_id', $user->id)->pluck('id');

        $screening = Screening::with([
            'instrument:id,name',
            'instrumentType:id,type_name',
            'sdqResult.psychologist:id,name',
            'srqResult.psychologist:id,name',
            'studentPin:id,pin_code,batch_id,subject_id',
            'studentPin.batch:id,label',
        ])
            ->where('id', $screeningId)
            ->whereHas('studentPin', fn ($q) => $q->whereIn('subject_id', $subjectIds))
            ->firstOrFail();

        return Inertia::render('Dashboard/Student/Screening/Result', [
            'screening' => $screening,
        ]);
    }
}
