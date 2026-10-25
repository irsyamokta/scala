<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Tambah value 'student' ke enum role pada tabel users.
     */
    public function up(): void
    {
        // MySQL tidak mendukung ALTER COLUMN enum secara langsung,
        // sehingga kita gunakan raw statement.
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM(
            'superadmin',
            'parent',
            'school',
            'general',
            'psychologist',
            'student'
        ) NOT NULL DEFAULT 'general'");
    }

    public function down(): void
    {
        // Hapus value 'student' — pastikan tidak ada baris yang memakai role student
        // sebelum rollback.
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM(
            'superadmin',
            'parent',
            'school',
            'general',
            'psychologist'
        ) NOT NULL DEFAULT 'general'");
    }
};
