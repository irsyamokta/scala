<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Instrument\Controllers\InstrumentController;

Route::middleware(['auth', 'onboarding.complete', 'permission:dashboard.superadmin'])
    ->middleware('permission:manage.instrument')
    ->prefix('instrumen')
    ->group(function () {
        Route::get('/{type}', [InstrumentController::class, 'index'])->name('instrument.index');
        Route::post('/', [InstrumentController::class, 'store'])->name('instrument.store');
        Route::put('/{id}', [InstrumentController::class, 'update'])->name('instrument.update');
        Route::delete('/{id}', [InstrumentController::class, 'destroy'])->name('instrument.destroy');
        Route::delete('/question/{id}', [InstrumentController::class, 'destroyQuestion'])->name('instrument.question.destroy');
    });
