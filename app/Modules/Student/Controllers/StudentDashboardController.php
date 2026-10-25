<?php

namespace App\Modules\Student\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Screening;
use App\Models\Subject;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $subjectIds = Subject::where('owner_user_id', $user->id)->pluck('id');

        $screeningHistory = Screening::with([
            'instrument:id,name',
            'instrumentType:id,type_name',
            'sdqResult:id,screening_id,overall_category,total_difficulties,recommendation,date_analysis',
        ])
            ->whereIn('subject_id', $subjectIds)
            ->latest('date_taken')
            ->get(['id', 'subject_id', 'instrument_id', 'type_id', 'date_taken', 'status']);

        return Inertia::render('Dashboard/Student/Index', [
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
        ])
            ->where('id', $screeningId)
            ->whereIn('subject_id', $subjectIds)
            ->firstOrFail();

        return Inertia::render('Dashboard/Student/Screening/Result', [
            'screening' => $screening,
        ]);
    }
}
