<?php

use App\Modules\Dashboard\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete'])
    ->prefix('dashboard')
    ->get('/', [DashboardController::class, 'index'])
    ->name('dashboard');
