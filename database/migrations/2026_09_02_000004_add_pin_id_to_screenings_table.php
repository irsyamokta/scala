<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom pin_id ke tabel screenings untuk traceability
     * screening yang berasal dari alur PIN Guru BK.
     */
    public function up(): void
    {
        Schema::table('screenings', function (Blueprint $table) {
            $table->foreignUuid('pin_id')
                ->nullable()
                ->after('type_id')
                ->constrained('student_pins')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('screenings', function (Blueprint $table) {
            $table->dropForeign(['pin_id']);
            $table->dropColumn('pin_id');
        });
    }
};
