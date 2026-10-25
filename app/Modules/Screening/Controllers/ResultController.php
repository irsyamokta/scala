<?php

namespace App\Modules\Screening\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Screening\Requests\PsychologistNoteRequest;
use App\Modules\Screening\Services\ResultService;
use DomainException;
use Throwable;

class ResultController extends Controller
{
    public function __construct(
        protected ResultService $service
    ) {}

    public function updateSdq(PsychologistNoteRequest $request, $id)
    {
        try {

            $this->service->updateSdq(
                $id,
                $request->validated(),
                auth()->user()
            );

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem, silakan coba lagi'
            );
        }
    }

    public function updateSrq(PsychologistNoteRequest $request, $id)
    {
        try {

            $this->service->updateSrq(
                $id,
                $request->validated(),
                auth()->user()
            );

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'error' => $e->getMessage(),
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem, silakan coba lagi'
            );
        }
    }
}
