<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel PIN individual per siswa, satu PIN per siswa per batch.
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

            // PIN 8 karakter alfanumerik huruf besar, unik secara global
            $table->string('pin_code', 8)->unique();

            // Kapan PIN digunakan (null = belum dipakai)
            $table->timestamp('used_at')->nullable();

            // Screening yang terkait setelah PIN digunakan
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
