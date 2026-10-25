<?php

namespace App\Modules\PinBatch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PinBatch;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Superadmin: melihat semua PIN Batch dari seluruh sekolah.
 */
class SuperadminBatchController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $perPage = $request->integer('per_page', 15);

        $batches = PinBatch::with([
            'school:id,name',
            'class:id,class_name',
            'instrument:id,name',
            'assignedPsychologist:id,name',
        ])
            ->withCount('studentPins')
            ->withCount(['studentPins as used_pins_count' => fn ($q) => $q->whereNotNull('used_at')])
            ->when($search, fn ($q) => $q->where('label', 'like', "%{$search}%")
                ->orWhereHas('school', fn ($sq) => $sq->where('name', 'like', "%{$search}%"))
            )
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $stats = [
            'total' => PinBatch::count(),
            'active' => PinBatch::where('status', 'active')->count(),
            'closed' => PinBatch::where('status', 'closed')->count(),
            'assigned' => PinBatch::whereNotNull('assigned_psychologist_id')->count(),
        ];

        return Inertia::render('Dashboard/Superadmin/PinBatch/Index', [
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
