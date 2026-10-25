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
        Schema::table('sdq_results', function (Blueprint $table) {
            $table->foreignUuid('psychologist_user_id')
                ->nullable()
                ->after('screening_id')
                ->constrained('users')
                ->nullOnDelete();
        });

        Schema::table('srq_results', function (Blueprint $table) {
            $table->foreignUuid('psychologist_user_id')
                ->nullable()
                ->after('screening_id')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sdq_results', function (Blueprint $table) {
            $table->dropForeign(['psychologist_user_id']);
            $table->dropColumn('psychologist_user_id');
        });

        Schema::table('srq_results', function (Blueprint $table) {
            $table->dropForeign(['psychologist_user_id']);
            $table->dropColumn('psychologist_user_id');
        });
    }
};
