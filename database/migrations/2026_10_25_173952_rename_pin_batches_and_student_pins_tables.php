<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename pin_batches → batches
        if (Schema::hasTable('pin_batches') && ! Schema::hasTable('batches')) {
            Schema::rename('pin_batches', 'batches');
        }

        // Rename student_pins → batch_entries
        if (Schema::hasTable('student_pins') && ! Schema::hasTable('batch_entries')) {
            Schema::rename('student_pins', 'batch_entries');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('batches') && ! Schema::hasTable('pin_batches')) {
            Schema::rename('batches', 'pin_batches');
        }

        if (Schema::hasTable('batch_entries') && ! Schema::hasTable('student_pins')) {
            Schema::rename('batch_entries', 'student_pins');
        }
    }
};
