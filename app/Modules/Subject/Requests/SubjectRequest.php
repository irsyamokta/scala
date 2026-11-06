<?php

namespace App\Modules\Subject\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'nis' => 'required|digits_between:1,20',
            'gender' => 'required|in:male,female',
            'tanggal_lahir' => 'required|date_format:Y-m-d|before:today',
            'class_id' => 'nullable|uuid|exists:classes,id',
            'is_self' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'nis.required' => 'NIS wajib diisi.',
            'nis.digits_between' => 'NIS harus berupa angka.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date_format' => 'Format tanggal lahir harus YYYY-MM-DD (contoh: 2010-05-12).',
            'tanggal_lahir.before' => 'Tanggal lahir tidak boleh di masa depan.',
        ];
    }
}
