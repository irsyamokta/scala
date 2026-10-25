<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * class_id nullable agar batch bisa mencakup lintas kelas (semua kelas).
     */
    public function up(): void
    {
        Schema::table('pin_batches', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->foreignUuid('class_id')
                ->nullable()
                ->change()
                ->constrained('classes')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pin_batches', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->foreignUuid('class_id')
                ->nullable(false)
                ->change()
                ->constrained('classes')
                ->cascadeOnDelete();
        });
    }
};
