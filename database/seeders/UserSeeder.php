<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Administrator',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'superadmin',
                'onboarding_completed_at' => now(),
            ]
        );

        $superadmin->assignRole('superadmin');

        $parent = User::updateOrCreate(
            ['email' => 'parent@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Sarinah',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'parent',
                'onboarding_completed_at' => now(),
            ]
        );

        $parent->assignRole('parent');

        $school = User::updateOrCreate(
            ['email' => 'school@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Ahmad',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'school',
                'onboarding_completed_at' => now(),
            ]
        );

        $school->assignRole('school');

        $general = User::updateOrCreate(
            ['email' => 'general@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Hasbi',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'general',
                'onboarding_completed_at' => now(),
            ]
        );

        $general->assignRole('general');

        $psychologist = User::updateOrCreate(
            ['email' => 'psychologist@example.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Lina',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
                'role' => 'psychologist',
                'onboarding_completed_at' => now(),
            ]
        );

        $psychologist->assignRole('psychologist');
    }
}
