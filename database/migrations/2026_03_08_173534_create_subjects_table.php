<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->enum('gender', ['male', 'female']);
            $table->integer('age');
            $table->foreignUuid('owner_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->boolean('is_self')->default(false);
            $table->boolean('has_previous_screening')->default(false);
            $table->enum('last_result', ['Normal', 'Borderline', 'Abnormal', 'Terindikasi', 'Tidak Terindikasi'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
