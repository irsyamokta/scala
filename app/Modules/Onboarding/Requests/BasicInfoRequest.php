<?php

namespace App\Modules\Onboarding\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BasicInfoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => 'required|string|max:255',
            'domicile' => 'required|string|max:255',
            'contact' => [
                'required',
                'string',
                'min:10',
                'max:15',
                Rule::unique('users', 'contact')->ignore($userId),
            ],
            'objective' => 'required|string|max:500',

            'age' => 'required|integer|min:1|max:75',
            'gender' => 'required|in:male,female',
        ];
    }
}
