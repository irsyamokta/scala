<?php

namespace App\Modules\Subject\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClassRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "class_name" => "required|string|max:100"
        ];
    }
}
