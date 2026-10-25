<?php

use App\Modules\Batch\Controllers\BatchController;
use App\Modules\Batch\Controllers\BatchScreeningController;
use App\Modules\Batch\Controllers\SuperadminBatchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete'])->prefix('batch')->group(function () {

    Route::get('/', [BatchController::class, 'index'])
        ->middleware('permission:manage.pin.batch|view.assigned.batch')
        ->name('batch.index');

    Route::post('/', [BatchController::class, 'store'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.store');

    Route::get('/{batch}', [BatchController::class, 'show'])
        ->middleware('permission:manage.pin.batch|view.assigned.batch')
        ->name('batch.show');

    Route::patch('/{batch}/close', [BatchController::class, 'close'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.close');

    Route::post('/{batch}/assign', [BatchController::class, 'assign'])
        ->middleware('permission:assign.batch')
        ->name('batch.assign');

    Route::get('/{batch}/export', [BatchController::class, 'export'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.export');

    Route::get('/{batch}/export-rekap', [BatchController::class, 'exportRecap'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.export-recap');

    Route::delete('/{batch}', [BatchController::class, 'destroy'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.destroy');

    Route::delete('/', [BatchController::class, 'destroyBulk'])
        ->middleware('permission:manage.pin.batch')
        ->name('batch.destroy-bulk');

    Route::get('/{batch}/screening/{screening}', [BatchScreeningController::class, 'show'])
        ->middleware('permission:view.assigned.batch')
        ->name('screening.batch.screening');
});

Route::middleware(['auth', 'onboarding.complete', 'permission:manage.users'])
    ->get('/admin/batch', [SuperadminBatchController::class, 'index'])
    ->name('admin.batch.index');
