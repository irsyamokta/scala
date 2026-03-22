<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get(
    '/',
    fn() =>
    auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Landing/Index')
);

Route::get('/uji-coba', function () {
    return Inertia::render('Trial/Index');
})->name('trial.index');

Route::prefix('srq-test')->group(function () {
    Route::get('/', fn() => Inertia::render('Trial/TrialTest'));
    Route::get('/hasil', fn() => Inertia::render('Trial/TestResult'));
});

require __DIR__ . '/dashboard.php';
require __DIR__ . '/onboarding.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/user.php';
require __DIR__ . '/instrument.php';
require __DIR__ . '/screening.php';
require __DIR__ . '/subject.php';
require __DIR__ . '/class.php';
require __DIR__ . '/auth.php';
