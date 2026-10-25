<?php

namespace App\Modules\Screening\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PinScreeningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pin_code' => 'required|string|size:8',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|uuid|exists:questions,id',
            'answers.*.score' => 'required|integer|min:0|max:2',
        ];
    }

    public function messages(): array
    {
        return [
            'pin_code.required' => 'PIN wajib diisi.',
            'pin_code.size' => 'PIN harus 8 karakter.',
            'answers.required' => 'Jawaban tidak boleh kosong.',
        ];
    }
}
