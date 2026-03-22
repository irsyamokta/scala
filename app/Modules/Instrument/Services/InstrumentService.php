<?php

namespace App\Modules\Instrument\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Question;
use App\Models\InstrumentType;
use App\Modules\Instrument\Repositories\InstrumentRepository;

class InstrumentService
{
    public function __construct(
        protected InstrumentRepository $repo
    ) {}

    public function getInstruments(string $type)
    {
        return $this->repo->getByName($type);
    }

    public function createInstrument(array $data)
    {
        return DB::transaction(function () use ($data) {

            $instrument = $this->repo->create([
                'name' => $data['name'],
            ]);

            foreach ($data['types'] as $type) {

                $instrumentType = InstrumentType::updateOrCreate(
                    [
                        'instrument_id' => $instrument->id,
                        'type_name' => $type['type_name']
                    ],
                    [
                        'min_age' => $type['min_age'],
                        'max_age' => $type['max_age'],
                        'is_baseline' => $type['is_baseline'] ?? false
                    ]
                );

                foreach ($type['questions'] as $question) {

                    $options = $this->generateOptions(
                        $instrument->name,
                        $question['is_reverse_scored'] ?? false
                    );

                    $domain = $instrument->name === 'SDQ'
                        ? $question['domain']
                        : null;

                    Question::create([
                        'instrument_id' => $instrument->id,
                        'type_id' => $instrumentType->id,
                        'question_number' => $question['question_number'],
                        'text' => $question['text'],
                        'domain' => $domain,
                        'is_reverse_scored' => $question['is_reverse_scored'] ?? false,
                        'options' => json_encode($options)
                    ]);
                }
            }

            return $instrument;
        });
    }

    public function updateInstrument($id, array $data)
    {
        $instrument = $this->repo->find($id);

        return DB::transaction(function () use ($instrument, $data) {

            $this->repo->update($instrument, [
                'name' => $data['name'],
            ]);

            /**
             * reset old relations
             */
            $instrument->questions()->delete();
            $instrument->instrumentTypes()->delete();

            foreach ($data['types'] as $type) {

                $instrumentType = InstrumentType::updateOrCreate(
                    [
                        'instrument_id' => $instrument->id,
                        'type_name' => $type['type_name']
                    ],
                    [
                        'min_age' => $type['min_age'],
                        'max_age' => $type['max_age'],
                        'is_baseline' => $type['is_baseline'] ?? false
                    ]
                );

                foreach ($type['questions'] as $question) {

                    $options = $this->generateOptions(
                        $instrument->name,
                        $question['is_reverse_scored'] ?? false
                    );

                    $domain = $instrument->name === 'SDQ'
                        ? $question['domain']
                        : null;

                    Question::create([
                        'instrument_id' => $instrument->id,
                        'type_id' => $instrumentType->id,
                        'question_number' => $question['question_number'],
                        'text' => $question['text'],
                        'domain' => $domain,
                        'is_reverse_scored' => $question['is_reverse_scored'] ?? false,
                        'options' => json_encode($options)
                    ]);
                }
            }

            return $instrument;
        });
    }

    public function deleteInstrument($id)
    {
        $instrument = $this->repo->find($id);

        return $this->repo->delete($instrument);
    }

    public function deleteQuestion($id)
    {
        $question = Question::findOrFail($id);

        return $question->delete();
    }

    private function generateOptions($instrumentName, $reverse = false)
    {
        if ($instrumentName === 'SDQ') {

            $scores = $reverse ? [2, 1, 0] : [0, 1, 2];

            return [
                ['label' => 'Tidak benar', 'score' => $scores[0]],
                ['label' => 'Mungkin benar', 'score' => $scores[1]],
                ['label' => 'Selalu benar', 'score' => $scores[2]],
            ];
        }

        if ($instrumentName === 'SRQ') {

            return [
                ['label' => 'Ya', 'score' => 1],
                ['label' => 'Tidak', 'score' => 0],
            ];
        }

        return [];
    }
}
