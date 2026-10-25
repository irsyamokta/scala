<?php

namespace App\Modules\Screening\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PsychologistNoteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [

            // SDQ
            'emotional_note' => 'nullable|string',
            'conduct_note' => 'nullable|string',
            'hyperactivity_note' => 'nullable|string',
            'peer_note' => 'nullable|string',
            'prosocial_note' => 'nullable|string',

            // SRQ
            'gme_note' => 'nullable|string',
            'substance_use_note' => 'nullable|string',
            'psychotic_symptom_note' => 'nullable|string',
            'ptsd_symptom_note' => 'nullable|string',
            'psychologist_note' => 'nullable|string',

            'recommendation' => 'required|string',
        ];
    }
}
