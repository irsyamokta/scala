<?php

namespace App\Modules\Screening\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Screening;
use App\Models\StudentPin;
use App\Models\Subject;
use App\Modules\Screening\Repositories\AnswerRepository;
use App\Modules\Screening\Repositories\InstrumentRepository;
use App\Modules\Screening\Repositories\SdqResultRepository;
use App\Modules\Screening\Repositories\SrqResultRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

/**
 * Alur skrining publik (guest) — siswa cukup input NIS + PIN.
 * Tidak perlu login/akun.
 */
class GuestScreeningController extends Controller
{
    public function __construct(
        protected InstrumentRepository $instrumentRepo,
        protected AnswerRepository $answerRepo,
        protected SdqResultRepository $sdqRepo,
        protected SrqResultRepository $srqRepo
    ) {}

    public function index()
    {
        return Inertia::render('Screening/Index');
    }

    public function enter(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|max:20',
            'pin_code' => 'required|string|size:8',
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'pin_code.required' => 'PIN wajib diisi.',
            'pin_code.size' => 'PIN harus 8 karakter.',
        ]);

        try {
            $pinCode = strtoupper(trim($request->pin_code));
            $nis = trim($request->nis);

            $subject = Subject::where('nis', $nis)->first();

            if (! $subject) {
                return back()->withErrors([
                    'nis' => 'NIS tidak ditemukan. Pastikan NIS Anda benar.',
                ]);
            }

            $pin = StudentPin::with('batch.instrument')
                ->where('pin_code', $pinCode)
                ->where('subject_id', $subject->id)
                ->first();

            if (! $pin) {
                return back()->withErrors([
                    'pin_code' => 'PIN tidak valid atau bukan milik NIS ini.',
                ]);
            }

            if ($pin->isUsed()) {
                return back()->withErrors([
                    'pin_code' => 'PIN ini sudah pernah digunakan.',
                ]);
            }

            if (! $pin->batch || $pin->batch->status === 'closed') {
                return back()->withErrors([
                    'pin_code' => 'Batch PIN ini sudah ditutup oleh Guru BK.',
                ]);
            }

            if ($pin->batch->isExpired()) {
                $exp = $pin->batch->expires_at->translatedFormat('d F Y, H:i');

                return back()->withErrors([
                    'pin_code' => "PIN ini sudah kedaluwarsa sejak {$exp}.",
                ]);
            }

            session([
                'guest_pin_id' => $pin->id,
                'guest_subject_id' => $subject->id,
            ]);

            return redirect()->route('guest.screening.form');

        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function form()
    {
        $pinId = session('guest_pin_id');
        $subjectId = session('guest_subject_id');

        if (! $pinId || ! $subjectId) {
            return redirect()->route('guest.screening.index')
                ->with('error', 'Sesi tidak valid. Silakan masukkan NIS dan PIN kembali.');
        }

        try {
            $pin = StudentPin::with('batch.instrument')->findOrFail($pinId);
            $subject = Subject::findOrFail($subjectId);

            if ($pin->isUsed()) {
                session()->forget(['guest_pin_id', 'guest_subject_id']);

                return redirect()->route('guest.screening.index')
                    ->with('error', 'PIN ini sudah pernah digunakan.');
            }

            $instrument = $pin->batch->instrument;
            $typeName = 'youth_self_report';

            $type = $this->instrumentRepo->findTypeByName($instrument->id, $typeName);

            if ($subject->age < $type->min_age || $subject->age > $type->max_age) {
                session()->forget(['guest_pin_id', 'guest_subject_id']);

                return redirect()->route('guest.screening.index')
                    ->with('error', 'Usia tidak sesuai dengan instrumen tes.');
            }

            $questions = $this->instrumentRepo->getQuestions($type->id);

            return Inertia::render('Screening/Test', [
                'pin' => ['id' => $pin->id, 'pin_code' => $pin->pin_code],
                'subject' => ['id' => $subject->id, 'name' => $subject->name],
                'instrument' => $instrument,
                'instrument_type' => $type,
                'questions' => $questions,
            ]);

        } catch (Throwable $e) {
            report($e);

            return redirect()->route('guest.screening.index')
                ->with('error', 'Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    public function submit(Request $request)
    {
        $request->validate([
            'pin_id' => 'required|uuid|exists:student_pins,id',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|uuid|exists:questions,id',
            'answers.*.score' => 'required|integer|min:0|max:2',
        ]);

        $pinId = session('guest_pin_id');
        $subjectId = session('guest_subject_id');

        if ($pinId !== $request->pin_id) {
            return back()->with('error', 'Sesi tidak valid. Silakan mulai ulang.');
        }

        try {
            $pin = StudentPin::with('batch.instrument')->findOrFail($pinId);
            $subject = Subject::findOrFail($subjectId);

            if ($pin->isUsed()) {
                return back()->with('error', 'PIN ini sudah pernah digunakan.');
            }

            $instrument = $pin->batch->instrument;
            $typeName = 'youth_self_report';
            $type = $this->instrumentRepo->findTypeByName($instrument->id, $typeName);

            DB::transaction(function () use ($request, $pin, $subject, $instrument, $type, $typeName) {

                $questionIds = collect($request->answers)->pluck('question_id');
                $questionMap = Question::whereIn('id', $questionIds)
                    ->pluck('question_number', 'id');

                $screening = Screening::create([
                    'subject_id' => $subject->id,
                    'reporter_user_id' => $subject->owner_user_id,
                    'instrument_id' => $instrument->id,
                    'type_id' => $type->id,
                    'pin_id' => $pin->id,
                    'date_taken' => now(),
                    'status' => 'Menunggu Evaluasi',
                ]);

                $answers = collect($request->answers)->map(fn ($ans) => [
                    'screening_id' => $screening->id,
                    'question_id' => $ans['question_id'],
                    'raw_score' => $ans['score'],
                ])->toArray();

                $this->answerRepo->insertMany($answers);

                if ($instrument->name === 'SDQ') {
                    $this->calculateSDQ($screening->id, $answers, $typeName, $questionMap);
                }

                $pin->update([
                    'used_at' => now(),
                    'screening_id' => $screening->id,
                ]);
            });

            session()->forget(['guest_pin_id', 'guest_subject_id']);

            return redirect()->route('guest.screening.done');

        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        }
    }

    public function done()
    {
        return Inertia::render('Screening/Done');
    }

    private function calculateSDQ(string $screeningId, array $answers, string $type, $questionMap): void
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
            'youth_self_report' => match (true) {
                $total <= 15 => 'Normal',
                $total <= 19 => 'Borderline',
                default => 'Abnormal',
            },
            default => 'Normal',
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

        Subject::whereHas('screenings', fn ($q) => $q->where('id', $screeningId))
            ->update(['last_result' => $category, 'has_previous_screening' => true]);
    }
}
