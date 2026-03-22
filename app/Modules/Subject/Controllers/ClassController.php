<?php

namespace App\Modules\Subject\Controllers;

use Throwable;
use DomainException;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\Subject\Services\ClassService;
use App\Modules\Subject\Requests\ClassRequest;

class ClassController extends Controller
{
    public function __construct(
        protected ClassService $service
    ) {}

    public function index()
    {
        $classes = $this->service->getClasses(auth()->id());

        return Inertia::render('Dashboard/School/Class/Index', [
            'classes' => $classes
        ]);
    }

    public function store(ClassRequest $request)
    {
        try {

            $this->service->createClass([
                ...$request->validated(),
                'school_user_id' => auth()->id()
            ]);

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'class_name' => $e->getMessage()
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with("error", "Terjadi kesalahan sistem");
        }
    }

    public function update(ClassRequest $request, $id)
    {
        try {

            $this->service->updateClass($id, $request->validated());

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with("error", "Terjadi kesalahan sistem");
        }
    }

    public function destroy($id)
    {
        try {

            $this->service->deleteClass($id);

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'class_name' => $e->getMessage()
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with("error", "Terjadi kesalahan sistem");
        }
    }
}
