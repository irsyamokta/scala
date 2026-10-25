<?php

namespace App\Modules\PinBatch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Instrument;
use App\Models\User;
use App\Modules\PinBatch\Exports\PinBatchExport;
use App\Modules\PinBatch\Requests\AssignPsychologistRequest;
use App\Modules\PinBatch\Requests\PinBatchRequest;
use App\Modules\PinBatch\Services\PinBatchService;
use DomainException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class PinBatchController extends Controller
{
    public function __construct(
        protected PinBatchService $service
    ) {}

    public function index(Request $request)
    {
        $user = auth()->user();
        $perPage = $request->integer('per_page', 10);

        if ($user->role === 'psychologist') {
            $batches = $this->service->getBatchesForPsychologist($user->id, $perPage);

            return Inertia::render('Dashboard/Psychologist/Batch/Index', [
                'batches' => $batches,
            ]);
        }

        $batches = $this->service->getBatchesForSchool($user->id, $perPage);

        $classes = \App\Models\Clazz::where('school_user_id', $user->id)
            ->select('id', 'class_name')
            ->get();

        $instruments = Instrument::select('id', 'name')->get();

        return Inertia::render('Dashboard/School/PinBatch/Index', [
            'batches' => $batches,
            'classes' => $classes,
            'instruments' => $instruments,
        ]);
    }

    public function store(PinBatchRequest $request)
    {
        try {
            $batch = $this->service->createBatch(
                $request->validated(),
                auth()->id()
            );

            return redirect()
                ->route('pin-batch.show', $batch->id)
                ->with('success', 'Batch PIN berhasil dibuat.');
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function show(string $id)
    {
        $user = auth()->user();
        $batch = $this->service->getBatchDetail($id);
        $pins = $this->service->getPinsForBatch($id);

        if ($user->role === 'psychologist') {
            return Inertia::render('Dashboard/Psychologist/Batch/Show', [
                'batch' => $batch,
                'pins' => $pins,
            ]);
        }

        $psychologists = User::where('role', 'psychologist')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Dashboard/School/PinBatch/Show', [
            'batch' => $batch,
            'pins' => $pins,
            'psychologists' => $psychologists,
        ]);
    }

    public function close(string $id)
    {
        try {
            $this->service->closeBatch($id, auth()->id());

            return back()->with('success', 'Batch berhasil ditutup.');
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function assign(AssignPsychologistRequest $request, string $id)
    {
        try {
            $this->service->assignPsychologist(
                $id,
                $request->validated()['psychologist_id'],
                auth()->id()
            );

            return back()->with('success', 'Psikolog berhasil di-assign.');
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function regeneratePin(string $batchId, string $pinId)
    {
        try {
            $this->service->regeneratePin($batchId, $pinId, auth()->id());

            return back()->with('success', 'PIN berhasil di-regenerate.');
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function export(string $id)
    {
        try {
            $batch = $this->service->getBatchDetail($id);
            $filename = 'pin-'.\Illuminate\Support\Str::slug($batch->label).'.xlsx';

            return Excel::download(new PinBatchExport($batch), $filename);
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Gagal mengekspor data.');
        }
    }

    public function exportRecap(string $id)
    {
        try {
            $batch = $this->service->getBatchDetail($id);

            if ($batch->school_user_id !== auth()->id()) {
                abort(403);
            }

            $filename = 'rekap-'.\Illuminate\Support\Str::slug($batch->label).'.xlsx';

            return Excel::download(
                new \App\Modules\PinBatch\Exports\PinBatchRecapExport($batch),
                $filename
            );
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Gagal mengekspor rekap.');
        }
    }

    public function destroy(string $id)
    {
        try {
            $batch = $this->service->getBatchDetail($id);

            if ($batch->school_user_id !== auth()->id()) {
                abort(403);
            }

            $batch->delete();

            return redirect()->route('pin-batch.index')
                ->with('success', 'Batch berhasil dihapus.');
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function destroyBulk(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'uuid|exists:pin_batches,id',
        ]);

        try {
            $deleted = \App\Models\PinBatch::whereIn('id', $request->ids)
                ->where('school_user_id', auth()->id())
                ->delete();

            return back()->with('success', "{$deleted} batch berhasil dihapus.");
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }
}
