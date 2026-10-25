<?php

namespace App\Modules\Screening\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScreeningRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'subject_id' => 'required|uuid|exists:subjects,id',

            'instrument' => 'required|in:SDQ,SRQ',

            'answers' => 'required|array|min:1',

            'answers.*.question_id' => 'required|uuid|exists:questions,id',

            'answers.*.score' => 'required|integer|min:0|max:2',
        ];
    }
}
