<?php

namespace App\Modules\StudentImport\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Clazz;
use App\Modules\StudentImport\Requests\StudentImportRequest;
use App\Modules\StudentImport\Services\StudentImportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class StudentImportController extends Controller
{
    public function __construct(
        protected StudentImportService $service
    ) {}

    public function index()
    {
        $user = auth()->user();
        $classes = Clazz::where('school_user_id', $user->id)
            ->select('id', 'class_name')
            ->get();

        return Inertia::render('Dashboard/School/StudentImport/Index', [
            'classes' => $classes,
        ]);
    }

    public function store(StudentImportRequest $request)
    {
        try {
            $result = $this->service->import(
                $request->file('file'),
                auth()->id()
            );

            $message = "Import selesai: {$result['success_count']} siswa berhasil ditambahkan.";

            if ($result['failure_count'] > 0) {
                $message .= " {$result['failure_count']} baris gagal.";

                $errorLines = collect($result['failures'])
                    ->take(3)
                    ->map(fn ($f) => "Baris {$f['row']}: ".implode(', ', $f['errors']))
                    ->implode(' | ');

                return redirect()->route('subject.school.index')
                    ->with('success', $message)
                    ->with('error', "Terdapat {$result['failure_count']} baris gagal diimport: {$errorLines}");
            }

            return redirect()->route('subject.school.index')
                ->with('success', $message);

        } catch (Throwable $e) {
            report($e);

            return back()->with('error', 'Gagal memproses file: '.$e->getMessage());
        }
    }

    public function result(Request $request)
    {
        $result = session('import_result');

        if (! $result) {
            return redirect()->route('subject.school.index')
                ->with('error', 'Tidak ada data hasil import.');
        }

        return Inertia::render('Dashboard/School/StudentImport/Result', [
            'result' => $result,
        ]);
    }

    public function template()
    {
        return $this->service->downloadTemplate();
    }

    public function downloadResult(Request $request)
    {
        // Successes bisa dikirim sebagai JSON string (dari form native) atau sebagai array (dari Inertia/axios)
        $raw = $request->input('successes', []);
        $successes = is_string($raw) ? json_decode($raw, true) : $raw;

        if (empty($successes)) {
            return back()->with('error', 'Tidak ada data untuk diunduh.');
        }

        return $this->service->downloadResult($successes);
    }
}
