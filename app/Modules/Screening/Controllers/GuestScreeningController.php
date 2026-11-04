<?php

namespace App\Modules\Screening\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Screening;
use App\Models\Subject;
use App\Modules\Batch\Repositories\BatchEntryRepository;
use App\Modules\Batch\Repositories\BatchRepository;
use App\Modules\Screening\Repositories\AnswerRepository;
use App\Modules\Screening\Repositories\InstrumentRepository;
use App\Modules\Screening\Repositories\SdqResultRepository;
use App\Modules\Screening\Repositories\SrqResultRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class GuestScreeningController extends Controller
{
    public function __construct(
        protected BatchRepository $batchRepo,
        protected BatchEntryRepository $participantRepo,
        protected InstrumentRepository $instrumentRepo,
        protected AnswerRepository $answerRepo,
        protected SdqResultRepository $sdqRepo,
        protected SrqResultRepository $srqRepo
    ) {}

    public function index(string $token)
    {
        $batch = $this->batchRepo->findByToken($token);

        if (! $batch || ! $batch->isUsable()) {
            return Inertia::render('Screening/Invalid');
        }

        return Inertia::render('Screening/Index', [
            'batch' => [
                'token' => $batch->access_token,
                'label' => $batch->label,
                'instrument' => $batch->instrument?->name,
                'expires_at' => $batch->expires_at?->toISOString(),
            ],
        ]);
    }

    public function enter(Request $request, string $token)
    {
        $request->validate([
            'nis' => 'required|string|max:20',
            'tanggal_lahir' => 'required|date_format:Y-m-d',
        ], [
            'nis.required' => 'NIS wajib diisi.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date_format' => 'Format tanggal lahir tidak valid.',
        ]);

        try {
            $batch = $this->batchRepo->findByToken($token);

            if (! $batch) {
                return back()->withErrors(['nis' => 'Link tes tidak valid.']);
            }

            if (! $batch->isUsable()) {
                return back()->withErrors(['nis' => 'Sesi tes ini sudah ditutup atau kedaluwarsa.']);
            }

            $subject = $this->resolveSubject($request->nis, $request->tanggal_lahir, $batch);

            if (! $subject) {
                return back()->withErrors([
                    'nis' => 'NIS atau tanggal lahir tidak cocok. Pastikan data Anda sesuai dengan yang didaftarkan.',
                ]);
            }

            if ($this->participantRepo->findByBatchAndSubject($batch->id, $subject->id)) {
                return back()->withErrors([
                    'nis' => 'Anda sudah pernah mengikuti tes ini.',
                ]);
            }

            $instrument = $batch->instrument;

            if ($instrument->name === 'SDQ' && $subject->age > 17) {
                return back()->withErrors([
                    'nis' => 'Instrumen SDQ hanya untuk siswa berusia 17 tahun ke bawah.',
                ]);
            }

            session([
                'guest_batch_id' => $batch->id,
                'guest_subject_id' => $subject->id,
            ]);

            return redirect()->route('guest.screening.form', $token);

        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function form(string $token)
    {
        $batchId = session('guest_batch_id');
        $subjectId = session('guest_subject_id');

        if (! $batchId || ! $subjectId) {
            return redirect()->route('guest.screening.index', $token)
                ->with('error', 'Sesi tidak valid. Silakan masukkan NIS dan tanggal lahir kembali.');
        }

        try {
            $batch = $this->batchRepo->findByToken($token);

            if (! $batch || $batch->id !== $batchId) {
                session()->forget(['guest_batch_id', 'guest_subject_id']);

                return redirect()->route('guest.screening.index', $token)
                    ->with('error', 'Sesi tidak valid.');
            }

            if (! $batch->isUsable()) {
                session()->forget(['guest_batch_id', 'guest_subject_id']);

                return Inertia::render('Screening/Invalid');
            }

            $subject = Subject::findOrFail($subjectId);
            $instrument = $batch->instrument;
            $typeName = 'youth_self_report';

            $type = $this->instrumentRepo->findTypeByName($instrument->id, $typeName);

            if ($subject->age < $type->min_age || $subject->age > $type->max_age) {
                session()->forget(['guest_batch_id', 'guest_subject_id']);

                return redirect()->route('guest.screening.index', $token)
                    ->with('error', 'Usia tidak sesuai dengan instrumen tes.');
            }

            $questions = $this->instrumentRepo->getQuestions($type->id);

            return Inertia::render('Screening/Test', [
                'batch' => ['id' => $batch->id, 'token' => $batch->access_token],
                'subject' => ['id' => $subject->id, 'name' => $subject->name],
                'instrument' => $instrument,
                'instrument_type' => $type,
                'questions' => $questions,
            ]);

        } catch (Throwable $e) {
            report($e);

            return redirect()->route('guest.screening.index', $token)
                ->with('error', 'Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    public function submit(Request $request, string $token)
    {
        $request->validate([
            'batch_id' => 'required|uuid|exists:batches,id',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|uuid|exists:questions,id',
            'answers.*.score' => 'required|integer|min:0|max:2',
        ]);

        $batchId = session('guest_batch_id');
        $subjectId = session('guest_subject_id');

        if ($batchId !== $request->batch_id) {
            return back()->with('error', 'Sesi tidak valid. Silakan mulai ulang.');
        }

        try {
            $batch = $this->batchRepo->findByToken($token);

            if (! $batch || ! $batch->isUsable()) {
                return back()->with('error', 'Sesi tes ini sudah ditutup atau kedaluwarsa.');
            }

            $subject = Subject::findOrFail($subjectId);

            if ($this->participantRepo->findByBatchAndSubject($batch->id, $subject->id)) {
                return back()->with('error', 'Anda sudah pernah mengikuti tes ini.');
            }

            $instrument = $batch->instrument;
            $typeName = 'youth_self_report';
            $type = $this->instrumentRepo->findTypeByName($instrument->id, $typeName);

            DB::transaction(function () use ($request, $batch, $subject, $instrument, $type, $typeName) {
                $questionIds = collect($request->answers)->pluck('question_id');
                $questionMap = Question::whereIn('id', $questionIds)
                    ->pluck('question_number', 'id');

                $screening = Screening::create([
                    'subject_id' => $subject->id,
                    'reporter_user_id' => $subject->owner_user_id,
                    'instrument_id' => $instrument->id,
                    'type_id' => $type->id,
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
                    $this->calculateSDQ($screening->id, $subject->id, $answers, $typeName, $questionMap);
                }

                $this->participantRepo->markUsed($batch->id, $subject->id, $screening->id);
            });

            session()->forget(['guest_batch_id', 'guest_subject_id']);

            return redirect()->route('guest.screening.done', $token);

        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        }
    }

    public function done(string $token)
    {
        return Inertia::render('Screening/Done');
    }

    /**
     * Untuk batch lintas kelas (class_id null), cari di semua kelas milik sekolah.
     */
    private function resolveSubject(string $nis, string $tanggalLahir, $batch): ?Subject
    {
        $query = Subject::where('nis', $nis)
            ->where('tanggal_lahir', $tanggalLahir)
            ->where('owner_user_id', $batch->school_user_id)
            ->where('is_self', false);

        if ($batch->class_id) {
            $query->where('class_id', $batch->class_id);
        }

        return $query->first();
    }

    private function calculateSDQ(string $screeningId, string $subjectId, array $answers, string $type, $questionMap): void
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

        Subject::where('id', $subjectId)
            ->update(['last_result' => $category, 'has_previous_screening' => true]);
    }
}
