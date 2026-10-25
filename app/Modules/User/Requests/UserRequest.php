<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
     *
     * @return array
     */
    public function rules()
    {
        $userId = $this->route('id');

        return [
            'name' => 'required|string|max:100',

            'email' => [
                'required',
                'email',
                'unique:users,email,'.$userId,
            ],

            'role' => 'required|string|in:parent,school,general,psychologist',

            'contact' => [
                'required',
                'string',
                'min:10',
                'max:15',
                Rule::unique('users', 'contact')->ignore($userId),
            ],

            'password' => $this->isMethod('post')
                ? 'required|string|min:8'
                : 'nullable|string|min:8',
        ];
    }
}
