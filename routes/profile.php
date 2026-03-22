<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::middleware(['auth', 'onboarding.complete', 'permission:manage.profile.account'])->group(function () {
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profil/school', [ProfileController::class, 'updateSchool'])->name('profile.school.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
