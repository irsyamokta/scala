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
        Schema::create('srq_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('screening_id')->unique()->constrained()->cascadeOnDelete();

            $table->integer('gme_score')->nullable();
            $table->boolean('gme_indication')->nullable();

            $table->boolean('substance_use_indication')->nullable();

            $table->boolean('psychotic_symptom_indication')->nullable();

            $table->boolean('ptsd_symptom_indication')->nullable();

            $table->text('psychologist_note')->nullable();
            $table->text('recommendation')->nullable();

            $table->dateTime('date_analysis')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srq_results');
    }
};
