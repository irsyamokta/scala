<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Screening\Controllers\ScreeningController;
use App\Modules\Screening\Controllers\ResultController;

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
