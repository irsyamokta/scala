<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel batch PIN yang dibuat Guru BK per kelas/instrumen.
     */
    public function up(): void
    {
        Schema::create('pin_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('school_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignUuid('class_id')
                ->constrained('classes')
                ->cascadeOnDelete();

            $table->foreignUuid('instrument_id')
                ->constrained('instruments')
                ->cascadeOnDelete();

            $table->foreignUuid('assigned_psychologist_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('label');

            $table->enum('status', ['active', 'closed'])->default('active');

            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pin_batches');
    }
};
