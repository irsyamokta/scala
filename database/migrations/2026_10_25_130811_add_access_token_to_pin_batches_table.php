<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('pin_batches', 'access_token')) {
            Schema::table('pin_batches', function (Blueprint $table) {
                $table->string('access_token', 16)->nullable()->unique()->after('label');
            });
        }

        // Isi access_token untuk batch yang sudah ada
        DB::table('pin_batches')->whereNull('access_token')->orderBy('id')->each(function ($batch) {
            DB::table('pin_batches')
                ->where('id', $batch->id)
                ->update(['access_token' => strtoupper(Str::random(12))]);
        });

        Schema::table('pin_batches', function (Blueprint $table) {
            $table->string('access_token', 16)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('pin_batches', function (Blueprint $table) {
            $table->dropColumn('access_token');
        });
    }
};
