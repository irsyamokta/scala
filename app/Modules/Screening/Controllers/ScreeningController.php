<?php

namespace App\Modules\Screening\Controllers;

use Throwable;
use DomainException;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Subject\Services\ClassService;
use App\Modules\Subject\Services\SubjectService;
use App\Modules\Screening\Services\ScreeningService;
use App\Modules\Screening\Requests\ScreeningRequest;

class ScreeningController extends Controller
{
    public function __construct(
        protected ScreeningService $service,
        protected ClassService $class,
        protected SubjectService $subject
    ) {}

    public function index(Request $request)
    {
        $user = auth()->user();

        $search = $request->search;
        $categories = $request->category;
        $perPage = $request->integer('per_page', 10);

        $filters = [
            'search' => $search,
            'category' => $categories,
            'per_page' => $perPage
        ];

        if (in_array($user->role, ['superadmin', 'psychologist'])) {

            $screenings = $this->service->getScreenings(
                $search,
                $categories,
                $perPage
            );

            $view = $user->role === 'superadmin'
                ? 'Dashboard/Superadmin/Screening/Index'
                : 'Dashboard/Psychologist/Screening/Index';

            return Inertia::render($view, [
                'screenings' => $screenings,
                'filters' => $filters
            ]);
        }

        if ($user->role === 'parent') {

            $subjects = $this->subject->getSubjects(
                $user->id,
                $user->role,
                null,
                null,
                null
            );

            return Inertia::render('Dashboard/Parent/Screening/Index', [
                'subjects' => $subjects
            ]);
        }

        if ($user->role === 'school') {

            $subjects = $this->subject->getSubjects(
                $user->id,
                $user->role,
                null,
                null,
                null
            );

            $classes = $this->class->getClasses($user->id);

            return Inertia::render('Dashboard/School/Screening/Index', [
                'classes' => $classes,
                'subjects' => $subjects
            ]);
        }

        if ($user->role === 'general') {

            $subjects = $this->subject->getSubjects(
                $user->id,
                $user->role,
                null,
                null,
                null
            );

            $classes = $this->class->getClasses($user->id);

            return Inertia::render('Dashboard/General/Screening/Index', [
                'subjects' => $subjects
            ]);
        }
    }

    public function create($instrument, $subjectId)
    {
        try {
            $user = auth()->user();

            $data = $this->service->getScreeningForm(
                $instrument,
                $subjectId,
                auth()->user()
            );

            if ($user->role === 'parent') {
                return Inertia::render(
                    'Dashboard/Parent/Screening/Test',
                    $data
                );
            }

            if ($user->role === 'school') {
                return Inertia::render(
                    'Dashboard/School/Screening/Test',
                    $data
                );
            }

            return Inertia::render(
                'Dashboard/General/Screening/Test',
                $data
            );
        } catch (DomainException $e) {

            return back()->with(
                "error",
                $e->getMessage()
            );
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                "error",
                "Terjadi kesalahan sistem"
            );
        }
    }

    public function store(ScreeningRequest $request)
    {
        try {
            $user = auth()->user();

            $screening = $this->service->submit(
                $request->validated(),
                auth()->user()
            );

            if ($user->role === 'parent') {
                return redirect()->route(
                    'subject.parent.show',
                    $screening->subject_id
                );
            }

            if ($user->role === 'school') {
                return redirect()->route(
                    'subject.school.show',
                    $screening->subject_id
                );
            }

            return redirect()->route(
                'subject.general.show',
                $screening->subject_id
            );
        } catch (DomainException $e) {

            return redirect()
                ->route('screening.index', $request->subject_id)
                ->with('error', $e->getMessage());
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                "error",
                "Terjadi kesalahan sistem"
            );
        }
    }
}
