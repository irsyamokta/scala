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
        Schema::create('sdq_results', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('screening_id')->unique()->constrained()->cascadeOnDelete();

            $table->integer('emotional_score')->nullable();
            $table->text('emotional_note')->nullable();

            $table->integer('conduct_score')->nullable();
            $table->text('conduct_note')->nullable();

            $table->integer('hyperactivity_score')->nullable();
            $table->text('hyperactivity_note')->nullable();

            $table->integer('peer_score')->nullable();
            $table->text('peer_note')->nullable();

            $table->integer('prosocial_score')->nullable();
            $table->text('prosocial_note')->nullable();

            $table->integer('total_difficulties')->nullable();

            $table->enum('overall_category', ['Normal', 'Borderline', 'Abnormal']);

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
        Schema::dropIfExists('sdq_results');
    }
};
