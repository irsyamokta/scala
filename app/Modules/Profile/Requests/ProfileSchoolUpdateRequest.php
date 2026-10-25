<?php

namespace App\Modules\Profile\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileSchoolUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'school_name' => ['required', 'string', 'max:255'],
            'school_level' => ['required', 'string', 'max:100'],
            'school_address' => ['required', 'string', 'max:500'],
        ];
    }
}
