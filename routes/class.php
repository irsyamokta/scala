<?php

use App\Modules\Subject\Controllers\ClassController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete', 'permission:manage.class'])->group(function () {
    Route::prefix('daftar-kelas')->group(function () {
        Route::get('/', [ClassController::class, 'index'])->name('class.index');
        Route::post('/', [ClassController::class, 'store'])->name('class.store');
        Route::patch('/{class}', [ClassController::class, 'update'])->name('class.update');
        Route::delete('/{class}', [ClassController::class, 'destroy'])->name('class.destroy');
    });
});
