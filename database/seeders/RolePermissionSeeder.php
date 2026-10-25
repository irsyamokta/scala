<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        /* Create Permissions */
        $permissions = [
            'dashboard.superadmin',
            'dashboard.parent',
            'dashboard.school',
            'dashboard.general',
            'dashboard.psychologist',
            'dashboard.student',

            'take.screening',
            'view.screening',
            'give.note',
            'give.recommendation',

            'manage.users',
            'manage.instrument',
            'manage.class',
            'manage.subject',
            'manage.profile.account',
            'manage.profile.school',

            // Permissions alur Guru BK
            'import.student',
            'manage.pin.batch',
            'assign.batch',

            // Permissions alur Psikolog (batch)
            'view.assigned.batch',

            // Permissions alur Siswa
            'view.own.result',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        /* Create Roles */
        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $parent = Role::firstOrCreate(['name' => 'parent']);
        $school = Role::firstOrCreate(['name' => 'school']);
        $general = Role::firstOrCreate(['name' => 'general']);
        $psychologist = Role::firstOrCreate(['name' => 'psychologist']);
        $student = Role::firstOrCreate(['name' => 'student']);

        /* Assign Permissions */
        $superadmin->givePermissionTo(Permission::all());

        $parent->givePermissionTo([
            'dashboard.parent',
            'take.screening',
            'view.screening',
            'manage.subject',
            'manage.profile.account',
        ]);

        $school->givePermissionTo([
            'dashboard.school',
            'manage.class',
            'manage.subject',
            'take.screening',
            'view.screening',
            'manage.profile.account',
            'manage.profile.school',
            'import.student',
            'manage.pin.batch',
            'assign.batch',
        ]);

        $general->givePermissionTo([
            'dashboard.general',
            'take.screening',
            'view.screening',
            'manage.profile.account',
        ]);

        $psychologist->givePermissionTo([
            'dashboard.psychologist',
            'manage.profile.account',
            'give.note',
            'give.recommendation',
            'view.assigned.batch',
        ]);

        $student->givePermissionTo([
            'dashboard.student',
            'take.screening',
            'view.own.result',
        ]);
    }
}
