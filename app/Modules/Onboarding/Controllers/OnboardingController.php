<?php

namespace App\Modules\Onboarding\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Onboarding\Requests\BasicInfoRequest;
use App\Modules\Onboarding\Requests\GeneralSubjectRequest;
use App\Modules\Onboarding\Requests\ParentSubjectRequest;
use App\Modules\Onboarding\Requests\RoleRequest;
use App\Modules\Onboarding\Requests\SchoolRequest;
use App\Modules\Onboarding\Services\OnboardingService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Throwable;

class OnboardingController extends Controller
{
    public function __construct(
        protected OnboardingService $service
    ) {}

    public function index()
    {
        $user = auth()->user()->load([
            'selfSubject',
            'childSubjects',
        ]);

        if ($user->onboarding_completed_at) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Onboarding/Index', [
            'user' => $user,
            'selfSubject' => $user->selfSubject,
            'subject' => $user->childSubjects->first(),
        ]);
    }

    public function role(RoleRequest $request)
    {
        try {
            $this->service->setRole(
                Auth::user(),
                $request->validated()['role']
            );
        } catch (DomainException $e) {

            return back()->withErrors([
                'role' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {
            return back()->withErrors([
                'Terjadi kesalahan, silahkan coba lagi',
            ]);
        }
    }

    public function basicInfo(BasicInfoRequest $request)
    {
        try {

            $this->service->saveBasicInfo(
                Auth::user(),
                $request->validated()
            );
        } catch (DomainException $e) {

            return back()->withErrors([
                'name' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {
            \Log::error($e);

            return back()->withErrors([
                'Terjadi kesalahan, silahkan coba lagi',
            ]);
        }
    }

    public function parent(ParentSubjectRequest $request)
    {
        try {

            $this->service->createParentSubject(
                Auth::user(),
                $request->validated()
            );
        } catch (DomainException $e) {

            return back()->withErrors([
                'subject' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {

            return back()->withErrors([
                'Terjadi kesalahan, silahkan coba lagi',
            ]);
        }
    }

    public function school(SchoolRequest $request)
    {
        try {
            $this->service->saveSchool(
                Auth::user(),
                $request->validated()
            );
        } catch (DomainException $e) {

            return back()->withErrors([
                'school' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {

            return back()->withErrors([
                'Terjadi kesalahan, silahkan coba lagi',
            ]);
        }
    }

    public function public(GeneralSubjectRequest $request)
    {
        try {

            $this->service->createGeneralSubject(
                Auth::user(),
                $request->validated()
            );
        } catch (DomainException $e) {

            return back()->withErrors([
                'subject' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {

            return back()->withErrors([
                'Terjadi kesalahan, silahkan coba lagi',
            ]);
        }
    }

    public function complete(Request $request)
    {
        $user = auth()->user();

        $user->update([
            'onboarding_completed_at' => now(),
        ]);

        return redirect()->route('dashboard');
    }
}
