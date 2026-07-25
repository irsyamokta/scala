<?php

namespace App\Modules\Profile\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();

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
