<?php

namespace App\Modules\Profile\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileService
{
    public function updateProfile(User $user, array $data): void
    {
        $updateData = [
            'name' => $data['name'],
        ];

        if (array_key_exists('domicile', $data) && $data['domicile'] !== null) {
            $updateData['domicile'] = $data['domicile'];
        }

        if (array_key_exists('contact', $data) && $data['contact'] !== null) {
            $updateData['contact'] = $data['contact'];
        }

        if (! empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        $user->update($updateData);

        if ($user->role !== 'superadmin' && isset($data['age'], $data['gender'])) {
            $user->subjects()->updateOrCreate(
                [
                    'owner_user_id' => $user->id,
                    'is_self' => true,
                ],
                [
                    'name' => $user->name,
                    'age' => $data['age'],
                    'gender' => $data['gender'],
                ]
            );
        }
    }

    public function updateSchool(User $user, array $data): void
    {
        $user->update($data);
    }

    public function deleteAccount(User $user): void
    {
        Auth::logout();
        $user->delete();
    }
}
