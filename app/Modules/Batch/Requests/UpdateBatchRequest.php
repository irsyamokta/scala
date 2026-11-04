<?php

namespace App\Modules\Batch\Requests;

use App\Models\Clazz;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => 'required|string|max:150',
            'expires_at' => 'nullable|date',
            'class_id' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if (! $value || $value === 'all') {
                        return;
                    }
                    if (! preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $value)) {
                        $fail('Kelas tidak valid.');

                        return;
                    }
                    if (! Clazz::where('id', $value)->exists()) {
                        $fail('Kelas tidak ditemukan.');
                    }
                },
            ],
            'instrument_id' => 'nullable|uuid|exists:instruments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'label.required' => 'Label batch wajib diisi.',
            'expires_at.date' => 'Format tanggal kedaluwarsa tidak valid.',
            'instrument_id.exists' => 'Instrumen tidak ditemukan.',
        ];
    }
}

