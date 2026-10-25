<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_pins', function (Blueprint $table) {
            $table->dropColumn('pin_code');
        });
    }

    public function down(): void
    {
        Schema::table('student_pins', function (Blueprint $table) {
            $table->string('pin_code', 8)->nullable()->after('subject_id');
        });
    }
};
