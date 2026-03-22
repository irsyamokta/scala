<?php

namespace App\Modules\Instrument\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstrumentRequest extends FormRequest
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
        $rules = [
            'name'     => ['required', 'string'],

            'types'               => ['required', 'array'],
            'types.*.type_name'   => ['required_with:types', 'string'],
            'types.*.min_age'  => ['required', 'integer'],
            'types.*.max_age'  => ['required', 'integer'],
            'types.*.is_baseline' => ['boolean'],

            'types.*.questions'         => ['nullable', 'array'],
            'types.*.questions.*'       => ['sometimes', 'array'],
            'types.*.questions.*.question_number' => ['required_with:types.*.questions.*', 'integer'],
            'types.*.questions.*.text'  => ['required_with:types.*.questions.*', 'string', 'min:1'],
            'types.*.questions.*.is_reverse_scored' => ['boolean'],
        ];

        if ($this->name === 'SDQ') {
            $rules['types.*.questions.*.domain'] = [
                'required_with:types.*.questions.*',
                'in:emotional_symptoms,conduct_problems,hyperactivity,peer_problems,prosocial'
            ];
        } else {
            $rules['types.*.questions.*.domain'] = ['nullable', 'string'];
        }

        return $rules;
    }

    /**
     * Custom pesan error (sangat penting biar tidak muncul pesan aneh)
     */
    public function messages()
    {
        return [
            'types.*.questions.*.text.required_with' => 'Pertanyaan wajib diisi teksnya.',
            'types.*.questions.*.domain.required_with' => 'Domain wajib dipilih untuk pertanyaan ini.',

            'types.*.questions.*.text.required' => 'Teks pertanyaan tidak boleh kosong.',

            'types.array' => 'Data jenis instrumen tidak valid.',
        ];
    }
}
