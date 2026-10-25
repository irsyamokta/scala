<?php

use App\Modules\Screening\Controllers\GuestScreeningController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get(
    '/',
    fn () => auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Landing/Index')
);

Route::get('/uji-coba', function () {
    return Inertia::render('Trial/Index');
})->name('trial.index');

Route::prefix('srq-test')->group(function () {
    Route::get('/', fn () => Inertia::render('Trial/TrialTest'));
    Route::get('/hasil', fn () => Inertia::render('Trial/TestResult'));
});

Route::prefix('skrining/{token}')->group(function () {
    Route::get('/', [GuestScreeningController::class, 'index'])
        ->name('guest.screening.index');

    Route::post('/masuk', [GuestScreeningController::class, 'enter'])
        ->name('guest.screening.enter');

    Route::get('/tes', [GuestScreeningController::class, 'form'])
        ->name('guest.screening.form');

    Route::post('/submit', [GuestScreeningController::class, 'submit'])
        ->name('guest.screening.submit');

    Route::get('/selesai', [GuestScreeningController::class, 'done'])
        ->name('guest.screening.done');
});

require __DIR__.'/dashboard.php';
require __DIR__.'/onboarding.php';
require __DIR__.'/profile.php';
require __DIR__.'/user.php';
require __DIR__.'/instrument.php';
require __DIR__.'/screening.php';
require __DIR__.'/subject.php';
require __DIR__.'/class.php';
require __DIR__.'/batch.php';
require __DIR__.'/student_import.php';
require __DIR__.'/auth.php';
