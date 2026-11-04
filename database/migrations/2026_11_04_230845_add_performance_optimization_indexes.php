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
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'users_role_index');
        });

        Schema::table('classes', function (Blueprint $table) {
            $table->index(['school_user_id', 'class_name'], 'classes_school_user_id_class_name_index');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->index(['owner_user_id', 'nis', 'tanggal_lahir'], 'subjects_owner_nis_dob_index');
            $table->index(['owner_user_id', 'is_self', 'class_id'], 'subjects_owner_self_class_index');
            $table->index('name', 'subjects_name_index');
        });

        Schema::table('batches', function (Blueprint $table) {
            $table->index(['school_user_id', 'status'], 'batches_school_user_id_status_index');
            $table->index(['assigned_psychologist_id', 'status'], 'batches_assigned_psychologist_status_index');
        });

        Schema::table('batch_entries', function (Blueprint $table) {
            $table->unique(['batch_id', 'subject_id'], 'batch_entries_batch_id_subject_id_unique');
            $table->index(['batch_id', 'used_at'], 'batch_entries_batch_id_used_at_index');
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->index(['subject_id', 'date_taken'], 'screenings_subject_id_date_taken_index');
            $table->index(['status', 'date_taken'], 'screenings_status_date_taken_index');
            $table->index('date_taken', 'screenings_date_taken_index');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->index(['type_id', 'question_number'], 'questions_type_id_question_number_index');
        });

        Schema::table('instruments', function (Blueprint $table) {
            $table->unique('name', 'instruments_name_unique');
        });

        Schema::table('instrument_types', function (Blueprint $table) {
            $table->index(['instrument_id', 'type_name'], 'instrument_types_instrument_type_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('instrument_types', function (Blueprint $table) {
            $table->dropIndex('instrument_types_instrument_type_index');
        });

        Schema::table('instruments', function (Blueprint $table) {
            $table->dropUnique('instruments_name_unique');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex('questions_type_id_question_number_index');
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->dropIndex('screenings_subject_id_date_taken_index');
            $table->dropIndex('screenings_status_date_taken_index');
            $table->dropIndex('screenings_date_taken_index');
        });

        Schema::table('batch_entries', function (Blueprint $table) {
            $table->dropUnique('batch_entries_batch_id_subject_id_unique');
            $table->dropIndex('batch_entries_batch_id_used_at_index');
        });

        Schema::table('batches', function (Blueprint $table) {
            $table->dropIndex('batches_school_user_id_status_index');
            $table->dropIndex('batches_assigned_psychologist_status_index');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropIndex('subjects_owner_nis_dob_index');
            $table->dropIndex('subjects_owner_self_class_index');
            $table->dropIndex('subjects_name_index');
        });

        Schema::table('classes', function (Blueprint $table) {
            $table->dropIndex('classes_school_user_id_class_name_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_index');
        });
    }
};
