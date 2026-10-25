<?php

namespace App\Modules\StudentImport\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:xlsx,xls',
                'max:5120', // 5 MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File Excel wajib diunggah.',
            'file.mimes' => 'Format file harus .xlsx atau .xls.',
            'file.max' => 'Ukuran file maksimal 5 MB.',
        ];
    }
}
