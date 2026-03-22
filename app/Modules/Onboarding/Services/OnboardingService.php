<?php

namespace App\Modules\Onboarding\services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Modules\Onboarding\Repositories\OnboardingRepository;

class OnboardingService
{
    public function __construct(
        protected OnboardingRepository $repo
    ) {}

    public function setRole(User $user, string $role)
    {
        DB::transaction(function () use ($user, $role) {

            $currentRole = $user->roles()->first()?->name;

            if ($currentRole && $currentRole !== $role) {
                $this->resetUserData($user);
            }

            $user->syncRoles([$role]);

            $this->repo->updateRole($user, $role);
        });
    }

    public function saveBasicInfo(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {

            $this->repo->updateBasicInfo($user, $data);

            $this->repo->upsertSubject([
                'name' => $user->name,
                'gender' => $data['gender'],
                'age' => $data['age'],
                'owner_user_id' => $user->id,
                'is_self' => true,
                'has_previous_screening' => false,
                'last_result' => null,
            ]);

            return $user->refresh();
        });
    }

    public function saveSchool(User $user, array $data)
    {
        return $this->repo->updateSchool($user, $data);
    }

    public function createParentSubject(User $user, array $data)
    {
        return $this->repo->upsertSubject([
            'name' => $data['name'],
            'gender' => $data['gender'],
            'age' => $data['age'],
            'owner_user_id' => $user->id,
            'is_self' => false,
            'has_previous_screening' => $data['has_previous_screening'],
            'last_result' => $data['last_result'] ?? null
        ]);
    }

    public function createGeneralSubject(User $user, array $data)
    {
        return $this->repo->upsertSubject([
            'name' => $user->name,
            'owner_user_id' => $user->id,
            'is_self' => true,
            'has_previous_screening' => $data['has_previous_screening'],
            'last_result' => $data['last_result'] ?? null
        ]);
    }

    public function updateOnboardingStatus(User $user)
    {
        return $this->repo->updateOnboardingStatus($user);
    }

    private function resetUserData(User $user)
    {
        $user->subjects()
            ->where('is_self', false)
            ->delete();

        $user->classes()->delete();

        $user->update([
            'school_name' => null,
            'school_address' => null,
            'school_phone' => null,
        ]);
    }
}
