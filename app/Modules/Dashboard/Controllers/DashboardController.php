<?php

namespace App\Modules\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $service
    ) {}

    public function index(Request $request)
    {
        $user = auth()->user();
        $month = $request->get('month') ?: now()->format('Y-m');
        $week = $request->week;
        $class = $request->get('class');

        return match ($user->role) {

            'superadmin' => Inertia::render('Dashboard/Superadmin/Home/Index', [
                'data' => $this->service->superadmin($month, $week),
            ]),

            'psychologist' => Inertia::render('Dashboard/Psychologist/Home/Index', [
                'data' => $this->service->psychologist(),
            ]),

            'parent' => Inertia::render('Dashboard/Parent/Home/Index', [
                'data' => $this->service->parent($user->id, $request->subject_id),
            ]),

            'school' => Inertia::render('Dashboard/School/Home/Index', [
                'data' => $this->service->school($user->id, $month, $class),
            ]),

            'general' => Inertia::render('Dashboard/General/Home/Index', [
                'data' => $this->service->general($user->id),
            ]),

            // Siswa tidak punya halaman /dashboard — redirect ke student dashboard
            'student' => redirect()->route('student.dashboard'),

            default => abort(403),
        };
    }
}
