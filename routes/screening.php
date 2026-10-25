<?php

use App\Modules\Screening\Controllers\ResultController;
use App\Modules\Screening\Controllers\ScreeningController;
use App\Modules\Student\Controllers\StudentDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete'])->prefix('tes-skrining')->group(function () {

    Route::get('/', [ScreeningController::class, 'index'])->name('screening.index');

    Route::middleware('permission:take.screening')->group(function () {
        Route::get('/form/{instrument}/{subject}', [ScreeningController::class, 'create'])->name('screening.form');
        Route::post('/', [ScreeningController::class, 'store'])->name('screening.store');
    });

    Route::middleware('permission:give.note')->group(function () {
        Route::patch('/sdq-result/{id}', [ResultController::class, 'updateSdq'])->name('sdq-result.update');
        Route::patch('/srq-result/{id}', [ResultController::class, 'updateSrq'])->name('srq-result.update');
    });
});

Route::middleware(['auth', 'onboarding.complete', 'permission:dashboard.student'])
    ->prefix('student')
    ->group(function () {

        Route::get('/dashboard', [StudentDashboardController::class, 'index'])
            ->name('student.dashboard');

        Route::get('/hasil/{screening}', [StudentDashboardController::class, 'result'])
            ->middleware('permission:view.own.result')
            ->name('student.screening.result');
    });
