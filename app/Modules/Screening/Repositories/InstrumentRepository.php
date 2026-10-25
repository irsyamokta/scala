<?php

namespace App\Modules\Screening\Repositories;

use App\Models\Instrument;
use App\Models\InstrumentType;
use App\Models\Question;

class InstrumentRepository
{
    public function findInstrumentByName(string $name)
    {
        return Instrument::where('name', $name)->firstOrFail();
    }

    public function findTypeByName(string $instrumentId, string $type)
    {
        return InstrumentType::where('instrument_id', $instrumentId)
            ->where('type_name', $type)
            ->firstOrFail();
    }

    public function getQuestions(string $typeId)
    {
        return Question::where('type_id', $typeId)
            ->select('id', 'text', 'is_reverse_scored', 'options', 'question_number')
            ->orderBy('question_number')
            ->get();
    }
}
