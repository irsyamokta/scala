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
        Schema::table('srq_results', function (Blueprint $table) {

            $table->text('gme_note')
                ->nullable()
                ->after('gme_indication');

            $table->text('substance_use_note')
                ->nullable()
                ->after('substance_use_indication');

            $table->text('psychotic_symptom_note')
                ->nullable()
                ->after('psychotic_symptom_indication');

            $table->text('ptsd_symptom_note')
                ->nullable()
                ->after('ptsd_symptom_indication');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('srq_results', function (Blueprint $table) {

            $table->dropColumn([
                'gme_note',
                'substance_use_note',
                'psychotic_symptom_note',
                'ptsd_symptom_note'
            ]);
        });
    }
};