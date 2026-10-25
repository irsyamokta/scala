<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ganti student_user_id → subject_id di tabel batch entries.
     * Entry sekarang terkait langsung ke Subject (data siswa),
     * bukan ke akun User siswa.
     */
    public function up(): void
    {
        Schema::table('student_pins', function (Blueprint $table) {
            $table->dropForeign(['student_user_id']);
            $table->dropColumn('student_user_id');
        });

        Schema::table('student_pins', function (Blueprint $table) {
            $table->foreignUuid('subject_id')
                ->after('batch_id')
                ->constrained('subjects')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('student_pins', function (Blueprint $table) {
            $table->dropForeign(['subject_id']);
            $table->dropColumn('subject_id');
        });

        Schema::table('student_pins', function (Blueprint $table) {
            $table->foreignUuid('student_user_id')
                ->after('batch_id')
                ->constrained('users')
                ->cascadeOnDelete();
        });
    }
};
