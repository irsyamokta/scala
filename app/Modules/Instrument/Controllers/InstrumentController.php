<?php

namespace App\Modules\Instrument\Controllers;

use Throwable;
use DomainException;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Modules\Instrument\Services\InstrumentService;
use App\Modules\Instrument\Requests\InstrumentRequest;

class InstrumentController extends Controller
{
    public function __construct(
        protected InstrumentService $service
    ) {}

    public function index($type)
    {
        $instruments = $this->service->getInstruments($type);

        $page = match ($type) {
            'SDQ' => 'Dashboard/Superadmin/Instrument/SDQ/Index',
            'SRQ' => 'Dashboard/Superadmin/Instrument/SRQ/Index',
            default => abort(404)
        };

        return Inertia::render($page, [
            'instruments' => $instruments
        ]);
    }

    public function store(InstrumentRequest $request)
    {
        try {

            $this->service->createInstrument(
                $request->validated()
            );

            return back();
        } catch (DomainException $e) {

            return back()->withErrors([
                'name' => $e->getMessage()
            ]);
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem'
            );
        }
    }

    public function update(InstrumentRequest $request, $id)
    {
        try {

            $this->service->updateInstrument(
                $id,
                $request->validated()
            );

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem'
            );
        }
    }

    public function destroy($id)
    {
        try {

            $this->service->deleteInstrument($id);

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Terjadi kesalahan sistem'
            );
        }
    }

    public function destroyQuestion($id)
    {
        try {

            $this->service->deleteQuestion($id);

            return back();
        } catch (Throwable $e) {

            report($e);

            return back()->with(
                'error',
                'Gagal menghapus pertanyaan'
            );
        }
    }
}
