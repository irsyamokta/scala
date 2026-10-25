<?php

use App\Modules\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarding.complete', 'permission:dashboard.superadmin'])
    ->middleware('permission:manage.users')
    ->prefix('pengguna')
    ->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('user.index');
        Route::post('/', [UserController::class, 'store'])->name('user.store');
        Route::patch('/{id}', [UserController::class, 'update'])->name('user.update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('user.destroy');
    });
