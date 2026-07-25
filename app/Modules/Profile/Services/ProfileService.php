<?php

namespace App\Modules\Profile\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileService
{
    public function updateProfile(User $user, array $data): void
    {
        $user->update([
            'name' => $data['name'],
            'domicile' => $data['domicile'],
            'contact' => $data['contact'],
        ]);

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
