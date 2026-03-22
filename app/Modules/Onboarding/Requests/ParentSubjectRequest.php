<?php

namespace App\Modules\Onboarding\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParentSubjectRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'age' => 'required|integer|min:4|max:100',
            'has_previous_screening' => 'required|boolean',
            'last_result' => 'nullable|in:Normal,Borderline,Abnormal|Terindikasi,Tidak Terindikasi',
        ];
    }

    public function messages(): array
    {
        return [
            'age.min' => 'Minimal usia untuk anak adalah :min tahun.',
        ];
    }
}
