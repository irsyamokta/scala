<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            // NIS (Nomor Induk Siswa) — nullable karena siswa non-sekolah tidak punya
            $table->string('nis', 20)->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn('nis');
        });
    }
};
