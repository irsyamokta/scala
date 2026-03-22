<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $role = auth()->user()->role;

        return match ($role) {
            'superadmin' => Inertia::render('Dashboard/Superadmin/Home/Index'),
            'school' => Inertia::render('Dashboard/School/Home/Index'),
            'parent' => Inertia::render('Dashboard/Parent/Home/Index'),
            'general' => Inertia::render('Dashboard/General/Home/Index'),
            'psychologist' => Inertia::render('Dashboard/Psychologist/Home/Index'),
            default => abort(403),
        };
    }
}
