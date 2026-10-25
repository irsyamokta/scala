<?php

namespace App\Modules\PinBatch\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PinBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'all' untuk semua kelas, atau UUID kelas tertentu
            'class_id' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value === 'all') {
                        return;
                    }
                    if (! preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $value)) {
                        $fail('Kelas tidak valid.');

                        return;
                    }
                    if (! \App\Models\Clazz::where('id', $value)->exists()) {
                        $fail('Kelas tidak ditemukan.');
                    }
                },
            ],
            'instrument_id' => 'required|uuid|exists:instruments,id',
            'label' => 'required|string|max:150',
            'expires_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required' => 'Kelas wajib dipilih.',
            'instrument_id.required' => 'Instrumen wajib dipilih.',
            'instrument_id.exists' => 'Instrumen tidak ditemukan.',
            'label.required' => 'Label batch wajib diisi.',
            'expires_at.after' => 'Tanggal kedaluwarsa harus di masa mendatang.',
            'expires_at.date_format' => 'Format tanggal kedaluwarsa tidak valid.',
        ];
    }
}
