<?php

namespace App\Modules\Subject\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubjectRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "name" => "required|string|max:100",
            "gender" => "required|in:male,female",
            "age" => "required|integer|min:4|max:100",
            "class_id" => "nullable|uuid|exists:classes,id",
            "is_self" => "boolean",
            "has_previous_screening" => "boolean",
            "last_result" => "nullable|in:Normal,Borderline,Abnormal,Terindikasi,Tidak Terindikasi",
        ];
    }
}
