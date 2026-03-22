<?php

namespace App\Modules\Onboarding\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SchoolRequest extends FormRequest
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
            'school_level' => 'required|in:TK,SD/MI,SMP/Mts,SMA/SMK',
            'school_name' => 'required|string|max:255',
            'school_address' => 'required|string|max:255',
            'screening_scope' => 'required|in:single_student,multiple_student,classroom'
        ];
    }
}
