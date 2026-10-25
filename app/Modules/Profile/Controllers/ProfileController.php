<?php

namespace App\Modules\Profile\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Profile\Requests\ProfileDestroyRequest;
use App\Modules\Profile\Requests\ProfileSchoolUpdateRequest;
use App\Modules\Profile\Requests\ProfileUpdateRequest;
use App\Modules\Profile\Services\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    protected ProfileService $service;

    public function __construct(ProfileService $service)
    {
        $this->service = $service;
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();
        $subject = $user->subjects()->where('is_self', true)->first();

        return Inertia::render('Profile/Index', [
            'subject' => $subject,
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $this->service->updateProfile($request->user(), $request->validated());

        return Redirect::route('profile.edit');
    }

    public function updateSchool(ProfileSchoolUpdateRequest $request): RedirectResponse
    {
        $this->service->updateSchool($request->user(), $request->validated());

        return Redirect::route('profile.edit');
    }

    public function destroy(ProfileDestroyRequest $request): RedirectResponse
    {
        $this->service->deleteAccount($request->user());

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
