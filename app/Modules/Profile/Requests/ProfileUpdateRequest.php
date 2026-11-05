<?php

namespace App\Modules\Profile\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Convert empty password string to null before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->password === '' || $this->password === null) {
            $this->merge(['password' => null]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        $isSuperadmin = $user->role === 'superadmin';

        if ($isSuperadmin) {
            return [
                'name' => ['required', 'string', 'max:255'],
                'domicile' => ['nullable', 'string', 'max:255'],
                'contact' => ['nullable', 'string', 'min:10', 'max:15', Rule::unique('users', 'contact')->ignore($user->id)],
                'password' => ['nullable', 'string', 'min:8'],
            ];
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'domicile' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'min:10', 'max:15', Rule::unique('users', 'contact')->ignore($user->id)],

            'age' => [
                'required',
                'integer',
                'max:75',
                Rule::when(
                    $user->role === 'general',
                    ['min:11'],
                    ['min:4']
                ),
            ],

            'gender' => ['string', 'max:255', 'in:male,female'],
        ];
    }

    public function messages(): array
    {
        return [
            'age.min' => 'Minimal usia untuk akun ini adalah :min tahun.',
        ];
    }
}
