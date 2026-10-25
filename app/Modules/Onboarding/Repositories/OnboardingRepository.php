<?php

namespace App\Modules\Onboarding\Repositories;

use App\Models\Subject;
use App\Models\User;

class OnboardingRepository
{
    public function updateRole(User $user, string $role): User
    {
        $user->update([
            'role' => $role,
        ]);

        return $user;
    }

    public function updateBasicInfo(User $user, array $data): User
    {
        $user->update([
            'name' => $data['name'],
            'domicile' => $data['domicile'],
            'contact' => $data['contact'],
            'objective' => $data['objective'],
            'email_verified_at' => now(),
        ]);

        return $user;
    }

    public function updateSchool(User $user, array $data): User
    {
        $user->update([
            'school_name' => $data['school_name'],
            'school_level' => $data['school_level'],
            'school_address' => $data['school_address'],
            'screening_scope' => $data['screening_scope'],
        ]);

        return $user;
    }

    public function upsertSubject(array $data): Subject
    {
        return Subject::updateOrCreate(
            [
                'owner_user_id' => $data['owner_user_id'],
                'is_self' => $data['is_self'],
            ],
            $data
        );
    }

    public function updateOnboardingStatus(User $user): User
    {
        $user->update([
            'onboarding_completed_at' => now(),
        ]);

        return $user;
    }
}
