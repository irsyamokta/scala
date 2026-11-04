<?php

namespace App\Modules\Screening\Repositories;

use App\Models\Instrument;
use App\Models\InstrumentType;
use App\Models\Question;
use Illuminate\Support\Facades\Cache;

class InstrumentRepository
{
    public function findInstrumentByName(string $name)
    {
        return Cache::remember("instrument_name_{$name}", now()->addDay(), function () use ($name) {
            return Instrument::where('name', $name)->firstOrFail();
        });
    }

    public function findTypeByName(string $instrumentId, string $type)
    {
        return Cache::remember("instrument_type_{$instrumentId}_{$type}", now()->addDay(), function () use ($instrumentId, $type) {
            return InstrumentType::where('instrument_id', $instrumentId)
                ->where('type_name', $type)
                ->firstOrFail();
        });
    }

    public function getQuestions(string $typeId)
    {
        return Cache::remember("instrument_questions_{$typeId}", now()->addDay(), function () use ($typeId) {
            return Question::where('type_id', $typeId)
                ->select('id', 'text', 'is_reverse_scored', 'options', 'question_number')
                ->orderBy('question_number')
                ->get();
        });
    }
}
