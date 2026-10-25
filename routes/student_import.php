<?php

use App\Modules\StudentImport\Controllers\StudentImportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Student Import Routes
|--------------------------------------------------------------------------
| Import diakses dari modal di halaman Profil Siswa, bukan halaman terpisah.
|
*/

Route::middleware(['auth', 'onboarding.complete', 'permission:import.student'])
    ->prefix('import-siswa')
    ->group(function () {

        // Proses upload (POST dari modal di halaman Profil Siswa)
        Route::post('/', [StudentImportController::class, 'store'])
            ->name('student.import.store');

        // Download template Excel kosong
        Route::get('/template', [StudentImportController::class, 'template'])
            ->name('student.import.template');
    });
