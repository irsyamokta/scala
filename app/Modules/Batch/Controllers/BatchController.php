<?php

namespace App\Modules\Batch\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Clazz;
use App\Models\Instrument;
use App\Models\User;
use App\Modules\Batch\Exports\BatchExport;
use App\Modules\Batch\Exports\BatchRecapExport;
use App\Modules\Batch\Requests\AssignPsychologistRequest;
use App\Modules\Batch\Requests\BatchRequest;
use App\Modules\Batch\Requests\UpdateBatchRequest;
use App\Modules\Batch\Services\BatchService;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class BatchController extends Controller
{
    public function __construct(
        protected BatchService $service
    ) {}

    public function index(Request $request)
    {
        $user = auth()->user();
        $perPage = $request->integer('per_page', 10);

        if ($user->role === 'superadmin') {
            return redirect()->route('admin.batch.index');
        }

        if ($user->role === 'psychologist') {
            $batches = $this->service->getBatchesForPsychologist($user->id, $perPage);

            return Inertia::render('Dashboard/Psychologist/Batch/Index', [
                'batches' => $batches,
            ]);
        }

        $batches = $this->service->getBatchesForSchool($user->id, $perPage);

        $classes = Clazz::where('school_user_id', $user->id)
            ->select('id', 'class_name')
            ->get();

        $instruments = Instrument::select('id', 'name')->get();

        return Inertia::render('Dashboard/School/Batch/Index', [
            'batches' => $batches,
            'classes' => $classes,
            'instruments' => $instruments,
        ]);
    }

    public function store(BatchRequest $request)
    {
        try {
            $batch = $this->service->createBatch(
                $request->validated(),
                auth()->id()
            );

            return redirect()
                ->route('batch.show', $batch->id);
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function update(UpdateBatchRequest $request, string $id)
    {
        try {
            $this->service->updateBatch(
                $id,
                $request->validated(),
                auth()->id()
            );

            return back()->with('success', 'Batch Skrining berhasil diperbarui.');
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
        $participants = $this->service->getParticipantsForBatch($id);

        $screeningUrl = route('guest.screening.index', $batch->access_token);
        $qrCodeSvg = $this->generateQrSvg($screeningUrl);

        if ($user->role === 'psychologist') {
            return Inertia::render('Dashboard/Psychologist/Batch/Show', [
                'batch' => $batch,
                'participants' => $participants,
                'back_route' => route('batch.index'),
            ]);
        }

        $classes = Clazz::where('school_user_id', $batch->school_user_id)
            ->select('id', 'class_name')
            ->get();

        $instruments = Instrument::select('id', 'name')->get();

        $psychologists = User::where('role', 'psychologist')
            ->select('id', 'name')
            ->get();

        $backRoute = $user->role === 'superadmin'
            ? route('admin.batch.index')
            : route('batch.index');

        return Inertia::render('Dashboard/School/Batch/Show', [
            'batch' => $batch,
            'participants' => $participants,
            'classes' => $classes,
            'instruments' => $instruments,
            'psychologists' => $psychologists,
            'screening_url' => $screeningUrl,
            'qr_code_svg' => $qrCodeSvg,
            'back_route' => $backRoute,
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
            $batch = $this->service->getBatchDetail($id);
            $user = auth()->user();

            // Superadmin bisa assign ke batch milik sekolah manapun
            $actingAsSchool = $user->role === 'superadmin'
                ? $batch->school_user_id
                : $user->id;

            $this->service->assignPsychologist(
                $id,
                $request->validated()['psychologist_id'],
                $actingAsSchool
            );

            return back()->with('success', 'Psikolog berhasil di-assign.');
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
            $filename = 'peserta-'.Str::slug($batch->label).'.xlsx';

            return Excel::download(new BatchExport($batch), $filename);
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Gagal mengekspor data.');
        }
    }

    public function exportRecap(string $id)
    {
        try {
            $batch = $this->service->getBatchDetail($id);
            $user = auth()->user();

            if ($user->role !== 'superadmin' && $batch->school_user_id !== $user->id) {
                abort(403);
            }

            $filename = 'rekap-'.Str::slug($batch->label).'.xlsx';

            return Excel::download(new BatchRecapExport($batch), $filename);
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Gagal mengekspor rekap.');
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = auth()->user();

            if ($user->role !== 'superadmin') {
                abort(403);
            }

            $batch = $this->service->getBatchDetail($id);
            $batch->delete();

            return redirect()->route('batch.index')
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
            'ids.*' => 'uuid|exists:batches,id',
        ]);

        try {
            if (auth()->user()->role !== 'superadmin') {
                abort(403);
            }

            $deleted = Batch::whereIn('id', $request->ids)->delete();

            return back()->with('success', "{$deleted} batch berhasil dihapus.");
        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    private function generateQrSvg(string $url): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd
        );

        return (new Writer($renderer))->writeString($url);
    }
}
