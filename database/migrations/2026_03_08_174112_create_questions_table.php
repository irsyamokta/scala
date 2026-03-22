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
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('instrument_id')->constrained('instruments')->cascadeOnDelete();
            $table->foreignUuid('type_id')->nullable()->constrained('instrument_types')->nullOnDelete();
            $table->integer('question_number');
            $table->string('text');
            $table->enum('domain', ['emotional_symptoms', 'conduct_problems', 'hyperactivity', 'peer_problems', 'prosocial'])->nullable();
            $table->boolean('is_reverse_scored')->default(false);
            $table->json('options');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
