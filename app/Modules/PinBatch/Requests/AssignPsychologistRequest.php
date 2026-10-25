<?php

namespace App\Modules\PinBatch\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignPsychologistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'psychologist_id' => [
                'required',
                'uuid',
                'exists:users,id',
                // Pastikan user yang dipilih memang role psychologist
                function ($attribute, $value, $fail) {
                    $user = \App\Models\User::find($value);
                    if (! $user || $user->role !== 'psychologist') {
                        $fail('User yang dipilih bukan psikolog.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'psychologist_id.required' => 'Psikolog wajib dipilih.',
            'psychologist_id.exists' => 'Psikolog tidak ditemukan.',
        ];
    }
}
