<?php

namespace App\Modules\Batch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SuperadminBatchController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $perPage = $request->integer('per_page', 15);

        $batches = Batch::with([
            'school:id,name,school_name',
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
        ])
            ->withCount(['entries as tested_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->addSelect(DB::raw('(
                SELECT count(*) FROM subjects
                WHERE subjects.owner_user_id = batches.school_user_id
                AND subjects.is_self = 0
                AND (subjects.class_id = batches.class_id OR batches.class_id IS NULL)
            ) as total_subjects'))
            ->when($search, fn ($q) => $q->where('label', 'like', "%{$search}%")
                ->orWhereHas('school', fn ($sq) => $sq->where('name', 'like', "%{$search}%"))
            )
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $rawStats = Batch::selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = "closed" THEN 1 ELSE 0 END) as closed,
            SUM(CASE WHEN assigned_psychologist_id IS NOT NULL THEN 1 ELSE 0 END) as assigned
        ')->first();

        $stats = [
            'total' => (int) ($rawStats->total ?? 0),
            'active' => (int) ($rawStats->active ?? 0),
            'closed' => (int) ($rawStats->closed ?? 0),
            'assigned' => (int) ($rawStats->assigned ?? 0),
        ];

        return Inertia::render('Dashboard/Superadmin/Batch/Index', [
            'batches' => $batches,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }
}
