<?php

use App\Modules\Onboarding\Controllers\OnboardingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->prefix('onboarding')->group(function () {

    Route::get('/', [OnboardingController::class, 'index'])->name('onboarding.index');

    Route::post('/role', [OnboardingController::class, 'role'])->name('onboarding.role');
    Route::post('/basic-info', [OnboardingController::class, 'basicInfo'])->name('onboarding.basic');
    Route::post('/parent', [OnboardingController::class, 'parent'])->name('onboarding.parent');
    Route::post('/school', [OnboardingController::class, 'school'])->name('onboarding.school');
    Route::post('/public', [OnboardingController::class, 'public'])->name('onboarding.general');

    Route::get('/processing', fn () => Inertia::render('Onboarding/Partials/ProcessingStep'))
        ->name('onboarding.processing');

    Route::post('/complete', [OnboardingController::class, 'complete'])
        ->name('onboarding.complete');
});
