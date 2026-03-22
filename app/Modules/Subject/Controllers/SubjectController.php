<?php

namespace App\Modules\Subject\Controllers;

use Throwable;
use DomainException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\Subject\Services\ClassService;
use App\Modules\Subject\Services\SubjectService;
use App\Modules\Subject\Requests\SubjectRequest;

class SubjectController extends Controller
{
    public function __construct(
        protected SubjectService $service,
        protected ClassService $class
    ) {}

    public function index(Request $request)
    {
        $user = auth()->user();

        $search = $request->search;
        $genders = $request->gender;
        $classIds = $request->class_id;
        $classes = $this->class->getClasses($user->id);

        $subjects = $this->service->getSubjects(
            $user->id,
            $user->role,
            $search,
            $genders,
            $classIds
        );

        if ($user->role == 'parent') {
            return Inertia::render('Dashboard/Parent/Subject/Index', [
                'subjects' => $subjects,
                'filters' => [
                    'search' => $search,
                    'gender' => $genders,
                ],
            ]);
        }

        $classes = $this->class->getClasses($user->id);

        return Inertia::render('Dashboard/School/Subject/Index', [
            'classes' => $classes->map(fn($c) => [
                'value' => (string) $c->id,
                'label' => $c->class_name,
            ]),
            'subjects' => $subjects,
            'filters' => [
                'search' => $search,
                'gender' => $genders,
                'class_id' => $classIds,
            ],
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();

        $subject = $this->service->findSubject($id);

        $screenings = $this->service->getSubjectScreenings($id);

        if ($user->role == 'parent') {
            return Inertia::render('Dashboard/Parent/Subject/Show', [
                'subject' => $subject,
                'screenings' => $screenings
            ]);
        }

        if ($user->role == 'school') {
            return Inertia::render('Dashboard/School/Subject/Show', [
                'subject' => $subject,
                'screenings' => $screenings
            ]);
        }

        return Inertia::render('Dashboard/General/Subject/Show', [
            'subject' => $subject,
            'screenings' => $screenings
        ]);
    }

    public function store(SubjectRequest $request)
    {
        try {

            $this->service->createSubject([
                ...$request->validated(),
                'owner_user_id' => auth()->id()
            ], auth()->user()->role);

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'class_id' => $e->getMessage()
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                "error",
                "Terjadi kesalahan sistem"
            );
        }
    }

    public function update(SubjectRequest $request, $id)
    {
        try {

            $this->service->updateSubject($id, $request->validated());

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                "error",
                "Terjadi kesalahan sistem"
            );
        }
    }

    public function destroy($id)
    {
        try {

            $this->service->deleteSubject($id);

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                "error",
                "Terjadi kesalahan sistem"
            );
        }
    }
}
