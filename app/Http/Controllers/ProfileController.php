<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileSchoolUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $subject = $user->subjects()
            ->where('is_self', true)
            ->first();

        return Inertia::render('Profile/Index', [
            'subject' => $subject
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'domicile' => $validated['domicile'],
            'contact' => $validated['contact'],
        ]);

        $user->subjects()->updateOrCreate(
            [
                'owner_user_id' => $user->id,
                'is_self' => true,
            ],
            [
                'name' => $user->name,
                'age' => $validated['age'],
                'gender' => $validated['gender'],
            ]
        );

        return Redirect::route('profile.edit');
    }

    /**
     * Update the user's school information.
     */
    public function updateSchool(ProfileSchoolUpdateRequest $request)
    {
        $request->user()->update($request->validated());

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
