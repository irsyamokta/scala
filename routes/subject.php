<?php

use App\Modules\Subject\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete', 'permission:manage.subject'])->group(function () {

    Route::get('/profil-keluarga', [SubjectController::class, 'index'])
        ->middleware('permission:dashboard.parent')
        ->name('subject.parent.index');

    Route::get('/profil-keluarga/{subject}', [SubjectController::class, 'show'])
        ->name('subject.parent.show');

    Route::get('/profil-siswa', [SubjectController::class, 'index'])
        ->middleware('permission:dashboard.school')
        ->name('subject.school.index');

    Route::get('/profil-siswa/{subject}', [SubjectController::class, 'show'])
        ->name('subject.school.show');

    Route::prefix('subject')->group(function () {
        Route::post('/', [SubjectController::class, 'store'])->name('subject.store');
        Route::patch('/{subject}', [SubjectController::class, 'update'])->name('subject.update');
        Route::delete('/{subject}', [SubjectController::class, 'destroy'])->name('subject.destroy');
    });
});

// general
Route::get('/riwayat-tes/{subject}', [SubjectController::class, 'show'])
    ->name('subject.general.show')
    ->middleware(['auth', 'onboarding.complete', 'permission:view.screening']);
