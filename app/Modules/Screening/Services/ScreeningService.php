<?php

namespace App\Modules\Screening\Services;

use App\Models\Question;
use App\Models\Subject;
use App\Modules\Screening\Repositories\AnswerRepository;
use App\Modules\Screening\Repositories\InstrumentRepository;
use App\Modules\Screening\Repositories\ScreeningRepository;
use App\Modules\Screening\Repositories\SdqResultRepository;
use App\Modules\Screening\Repositories\SrqResultRepository;
use DomainException;
use Illuminate\Support\Facades\DB;

class ScreeningService
{
    public function __construct(
        protected ScreeningRepository $screeningRepo,
        protected InstrumentRepository $instrumentRepo,
        protected AnswerRepository $answerRepo,
        protected SdqResultRepository $sdqRepo,
        protected SrqResultRepository $srqRepo
    ) {}

    public function getScreenings(?string $search, ?array $categories, int $perPage = 10)
    {
        return $this->screeningRepo->getPaginated($search, $categories, $perPage);
    }

    public function getScreeningForm($instrumentName, $subjectId, $user)
    {
        $subject = Subject::findOrFail($subjectId);

        $instrument = $this->instrumentRepo->findInstrumentByName($instrumentName);

        $typeName = $this->resolveType($user->role, $instrument->name);

        $type = $this->instrumentRepo->findTypeByName(
            $instrument->id,
            $typeName
        );

        $this->validateAge($subject->age, $type->min_age, $type->max_age);

        $this->validateCooldown($subject->id, $instrument->id);

        $questions = $this->instrumentRepo->getQuestions($type->id);

        return [
            'subject' => $subject,
            'instrument' => $instrument,
            'instrument_type' => $type,
            'questions' => $questions,
        ];
    }

    public function submit(array $data, $user)
    {
        $subject = Subject::findOrFail($data['subject_id']);

        $instrument = $this->instrumentRepo->findInstrumentByName(
            $data['instrument']
        );

        $typeName = $this->resolveType($user->role, $instrument->name);

        $type = $this->instrumentRepo->findTypeByName(
            $instrument->id,
            $typeName
        );

        $this->validateAge($subject->age, $type->min_age, $type->max_age);

        $this->validateCooldown($subject->id, $instrument->id);

        return DB::transaction(function () use ($data, $user, $subject, $instrument, $type, $typeName) {

            $questionIds = collect($data['answers'])->pluck('question_id');

            $questionMap = Question::whereIn('id', $questionIds)
                ->pluck('question_number', 'id');

            $screening = $this->screeningRepo->create([
                'subject_id' => $subject->id,
                'reporter_user_id' => $user->id,
                'instrument_id' => $instrument->id,
                'type_id' => $type->id,
                'date_taken' => now(),
                'status' => 'Menunggu Evaluasi',
            ]);

            $answers = collect($data['answers'])->map(function ($ans) use ($screening) {
                return [
                    'screening_id' => $screening->id,
                    'question_id' => $ans['question_id'],
                    'raw_score' => $ans['score'],
                ];
            })->toArray();

            $this->answerRepo->insertMany($answers);

            if ($instrument->name === 'SDQ') {
                $this->calculateSDQ($screening->id, $subject->id, $answers, $typeName, $questionMap);
            }

            if ($instrument->name === 'SRQ') {
                $this->calculateSRQ($screening->id, $subject->id, $answers, $questionMap);
            }

            return $screening;
        });
    }

    private function resolveType($role, $instrument)
    {
        if ($instrument === 'SDQ') {

            return match ($role) {
                'parent' => 'parent_report',
                'school' => 'teacher_report',
                'general' => 'youth_self_report',
                'student' => 'youth_self_report',  // Siswa melaporkan diri sendiri
                default => throw new DomainException('Role tidak diperbolehkan'),
            };
        }

        if ($instrument === 'SRQ') {
            return 'self_report';
        }

        throw new DomainException('Instrument tidak dikenali');
    }

    private function validateAge($age, $min, $max)
    {
        if ($age < $min || $age > $max) {
            throw new DomainException('Usia tidak sesuai dengan instrumen');
        }
    }

    private function calculateSDQ($screeningId, $subjectId, $answers, $type, $questionMap)
    {
        $answers = collect($answers)->map(function ($a) use ($questionMap) {
            $a['question_number'] = $questionMap[$a['question_id']];

            return $a;
        });

        $emotional = $answers->whereIn('question_number', [3, 8, 13, 16, 24])->sum('raw_score');
        $conduct = $answers->whereIn('question_number', [5, 7, 12, 18, 22])->sum('raw_score');
        $hyperactivity = $answers->whereIn('question_number', [2, 10, 15, 21, 25])->sum('raw_score');
        $peer = $answers->whereIn('question_number', [6, 11, 14, 19, 23])->sum('raw_score');
        $prosocial = $answers->whereIn('question_number', [1, 4, 9, 17, 20])->sum('raw_score');

        $total = $emotional + $conduct + $hyperactivity + $peer;

        $category = match ($type) {
            'parent_report' => match (true) {
                $total <= 13 => 'Normal',
                $total <= 16 => 'Borderline',
                default => 'Abnormal'
            },
            'teacher_report' => match (true) {
                $total <= 11 => 'Normal',
                $total <= 15 => 'Borderline',
                default => 'Abnormal'
            },
            'youth_self_report' => match (true) {
                $total <= 15 => 'Normal',
                $total <= 19 => 'Borderline',
                default => 'Abnormal'
            },
        };

        $this->sdqRepo->create([
            'screening_id' => $screeningId,

            'emotional_score' => $emotional,
            'conduct_score' => $conduct,
            'hyperactivity_score' => $hyperactivity,
            'peer_score' => $peer,
            'prosocial_score' => $prosocial,

            'total_difficulties' => $total,
            'overall_category' => $category,
        ]);

        Subject::where('id', $subjectId)->update([
            'last_result' => $category,
            'has_previous_screening' => true,
        ]);
    }

    private function calculateSRQ($screeningId, $subjectId, $answers, $questionMap)
    {
        $yesAnswers = collect($answers)
            ->where('raw_score', 1)
            ->map(function ($a) use ($questionMap) {
                $a['question_number'] = $questionMap[$a['question_id']];

                return $a;
            });

        $gme = $yesAnswers
            ->whereBetween('question_number', [1, 20])
            ->count();

        $substanceUse = $yesAnswers
            ->where('question_number', 21)
            ->count() >= 1;

        $psychotic = $yesAnswers
            ->whereBetween('question_number', [22, 24])
            ->count() >= 1;

        $ptsd = $yesAnswers
            ->whereBetween('question_number', [25, 29])
            ->count() >= 1;

        $isIndicated =
            $gme >= 5 ||
            $substanceUse ||
            $psychotic ||
            $ptsd;

        $status = $isIndicated
            ? 'Terindikasi'
            : 'Tidak Terindikasi';

        $this->srqRepo->create([
            'screening_id' => $screeningId,
            'gme_score' => $gme,
            'gme_indication' => $gme >= 5,
            'substance_use_indication' => $substanceUse,
            'psychotic_symptom_indication' => $psychotic,
            'ptsd_symptom_indication' => $ptsd,
        ]);

        Subject::where('id', $subjectId)->update([
            'last_result' => $status,
            'has_previous_screening' => true,
        ]);
    }

    private function validateCooldown($subjectId, $instrumentId)
    {
        $lastScreening = $this->screeningRepo->getLastCompleted(
            $subjectId,
            $instrumentId
        );

        if (! $lastScreening) {
            return;
        }

        $nextAvailable = $lastScreening->date_taken->addHour();

        if (now()->lt($nextAvailable)) {
            $minutes = now()->diffInMinutes($nextAvailable);
            $minutes = ceil($minutes);

            throw new DomainException(
                "Tes dapat dilakukan kembali setelah {$minutes} menit."
            );
        }
    }
}
