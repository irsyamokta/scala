<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
                'name'                    => 'Administrator',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'superadmin',
                'onboarding_completed_at' => now(),
            ]
        );

        if (! $superadmin->wasRecentlyCreated) {
            $superadmin->id = $superadmin->id; // tetap UUID lama
        }

        $superadmin->assignRole('superadmin');

        $parent = User::updateOrCreate(
            ['email' => 'parent@example.com'],
            [
                'name'                    => 'Sarinah',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'parent',
                'onboarding_completed_at' => now(),
            ]
        );

        $parent->assignRole('parent');

        $school = User::updateOrCreate(
            ['email' => 'school@example.com'],
            [
                'name'                    => 'Ahmad',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'school',
                'onboarding_completed_at' => now(),
            ]
        );

        $school->assignRole('school');

        $general = User::updateOrCreate(
            ['email' => 'general@example.com'],
            [
                'name'                    => 'Hasbi',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'general',
                'onboarding_completed_at' => now(),
            ]
        );

        $general->assignRole('general');

        $psychologist = User::updateOrCreate(
            ['email' => 'psychologist@example.com'],
            [
                'name'                    => 'Lina',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'psychologist',
                'onboarding_completed_at' => now(),
            ]
        );

        $psychologist->assignRole('psychologist');

        $student = User::updateOrCreate(
            ['email' => 'student@example.com'],
            [
                'name'                    => 'Budi Santoso',
                'password'                => Hash::make('Password123!'),
                'email_verified_at'       => now(),
                'role'                    => 'student',
                // Siswa tidak melewati onboarding biasa; langsung di-set completed
                'onboarding_completed_at' => now(),
            ]
        );

        $student->assignRole('student');
    }
}
