<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Dashboard\Controllers\DashboardController;

Route::middleware(['auth', 'onboarding.complete'])
    ->prefix('dashboard')
    ->get('/', [DashboardController::class, 'index'])
    ->name('dashboard');
