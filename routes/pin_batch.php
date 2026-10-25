<?php

use App\Modules\PinBatch\Controllers\BatchScreeningController;
use App\Modules\PinBatch\Controllers\PinBatchController;
use App\Modules\PinBatch\Controllers\SuperadminBatchController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PIN Batch Routes
|--------------------------------------------------------------------------
|
| Guru BK: CRUD batch PIN dan assign psikolog
| Psikolog: melihat batch yang di-assign kepadanya
|
*/

Route::middleware(['auth', 'onboarding.complete'])->prefix('pin-batch')->group(function () {

    // Daftar batch — Guru BK melihat batch sendiri, Psikolog melihat batch assigned
    Route::get('/', [PinBatchController::class, 'index'])
        ->middleware('permission:manage.pin.batch|view.assigned.batch')
        ->name('pin-batch.index');

    // Simpan batch baru
    Route::post('/', [PinBatchController::class, 'store'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.store');

    // Detail batch
    Route::get('/{batch}', [PinBatchController::class, 'show'])
        ->middleware('permission:manage.pin.batch|view.assigned.batch')
        ->name('pin-batch.show');

    // Tutup batch
    Route::patch('/{batch}/close', [PinBatchController::class, 'close'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.close');

    // Assign psikolog ke batch
    Route::post('/{batch}/assign', [PinBatchController::class, 'assign'])
        ->middleware('permission:assign.batch')
        ->name('pin-batch.assign');

    // Regenerate PIN satu siswa dalam batch
    Route::post('/{batch}/pins/{pin}/regenerate', [PinBatchController::class, 'regeneratePin'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin.regenerate');

    // Export daftar PIN ke Excel
    Route::get('/{batch}/export', [PinBatchController::class, 'export'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.export');

    // Export rekap hasil analisis ke Excel
    Route::get('/{batch}/export-rekap', [PinBatchController::class, 'exportRecap'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.export-recap');

    // Hapus batch (single)
    Route::delete('/{batch}', [PinBatchController::class, 'destroy'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.destroy');

    // Hapus batch bulk
    Route::delete('/', [PinBatchController::class, 'destroyBulk'])
        ->middleware('permission:manage.pin.batch')
        ->name('pin-batch.destroy-bulk');

    // Psikolog: detail screening individual dalam batch
    Route::get('/{batch}/screening/{screening}', [BatchScreeningController::class, 'show'])
        ->middleware('permission:view.assigned.batch')
        ->name('screening.batch.screening');
});

// Superadmin: melihat semua batch lintas sekolah
Route::middleware(['auth', 'onboarding.complete', 'permission:manage.users'])
    ->get('/admin/pin-batch', [SuperadminBatchController::class, 'index'])
    ->name('admin.pin-batch.index');
