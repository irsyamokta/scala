<?php

namespace App\Modules\User\Repositories;

use App\Models\User;

class UserRepository
{
    public function getAll(?string $search = null, ?array $roles = null)
    {
        return $this->baseQuery($search, $roles)
            ->get()
            ->map(function ($user) {
                $gender = optional($user->selfSubject)->gender;
                $age = optional($user->selfSubject)->age;

                $children = [];

                if ($user->role === 'parent') {
                    $children = $user->subjects
                        ->where('is_self', false)
                        ->map(fn($s) => [
                            'name' => $s->name,
                            'gender' => $s->gender,
                            'age' => $s->age,
                        ])
                        ->values();
                }

                $students = [];

                if ($user->role === 'school') {
                    $students = $user->subjects
                        ->where('is_self', false)
                        ->map(fn($s) => [
                            'name' => $s->name,
                            'gender' => $s->gender,
                            'age' => $s->age,
                        ])
                        ->values();
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'contact' => $user->contact,
                    'domicile' => $user->domicile,
                    'role' => $user->role,
                    'objective' => $user->objective,

                    'school_name' => $user->school_name,
                    'school_level' => $user->school_level,
                    'school_address' => $user->school_address,

                    'gender' => $gender,
                    'age' => $age,

                    'children' => $children,

                    'created_at' => $user->created_at,
                ];
            });
    }

    public function getPaginated(?string $search = null, ?array $roles = null, int $perPage = 10)
    {
        return $this->baseQuery($search, $roles)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    private function baseQuery(?string $search, ?array $roles = null)
    {
        return User::query()
            ->select(
                'id',
                'name',
                'email',
                'contact',
                'domicile',
                'objective',
                'role',
                'school_name',
                'school_level',
                'school_address',
                'created_at'
            )
            ->with([
                'selfSubject:id,owner_user_id,gender,age,is_self',
                'subjects:id,owner_user_id,name,gender,age,is_self'
            ])
            ->where('role', '!=', 'superadmin')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('contact', 'like', "%{$search}%");
                });
            })
            ->when($roles, function ($query) use ($roles) {
                $query->whereIn('role', $roles);
            });
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function existsByEmail(string $email)
    {
        return User::where('email', $email)->exists();
    }

    public function existsByEmailExcept($id, string $email)
    {
        return User::where('email', $email)
            ->where('id', '!=', $id)
            ->exists();
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(User $user, array $data)
    {
        $user->update($data);
        return $user;
    }

    public function delete(User $user)
    {
        return $user->delete();
    }
}
