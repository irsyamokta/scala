<?php

namespace App\Modules\User\Services;

use App\Modules\User\Repositories\UserRepository;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        protected UserRepository $repo
    ) {}

    public function getUsers(
        ?string $search = null,
        ?array $roles = null,
        bool $paginate = true,
        int $perPage = 10
    ) {
        if ($paginate) {
            return $this->repo->getPaginated($search, $roles, $perPage);
        }

        return $this->repo->getAll($search, $roles);
    }

    public function createUser(array $data)
    {
        if ($this->repo->existsByEmail($data['email'])) {
            throw new DomainException('Email sudah terdaftar');
        }

        return DB::transaction(function () use ($data) {

            $role = $data['role'] ?? null;

            $user = $this->repo->create([
                ...$data,
                'password' => Hash::make($data['password']),
                'email_verified_at' => now(),
                'onboarding_completed_at' => now(),
            ]);

            $user->assignRole($role);

            return $user;
        });
    }

    public function updateUser($id, array $data)
    {
        $user = $this->repo->find($id);

        if (
            isset($data['email']) &&
            $this->repo->existsByEmailExcept($id, $data['email'])
        ) {
            throw new DomainException('Email sudah terdaftar');
        }

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $this->repo->update($user, $data);
    }

    public function deleteUser($id)
    {
        $user = $this->repo->find($id);

        return $this->repo->delete($user);
    }
}
