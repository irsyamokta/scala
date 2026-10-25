<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel batch entry per siswa, satu entry per siswa per batch.
     */
    public function up(): void
    {
        Schema::create('student_pins', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('batch_id')
                ->constrained('pin_batches')
                ->cascadeOnDelete();

            $table->foreignUuid('student_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('pin_code', 8)->unique();

            // Kapan entry digunakan (null = belum dipakai)
            $table->timestamp('used_at')->nullable();

            // Screening yang terkait setelah entry digunakan
            $table->foreignUuid('screening_id')
                ->nullable()
                ->constrained('screenings')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_pins');
    }
};
