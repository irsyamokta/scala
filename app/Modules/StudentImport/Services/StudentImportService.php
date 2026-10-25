<?php

namespace App\Modules\StudentImport\Services;

use App\Modules\StudentImport\Exports\StudentImportResultExport;
use App\Modules\StudentImport\Exports\StudentImportTemplateExport;
use App\Modules\StudentImport\Imports\StudentImport;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class StudentImportService
{
    /**
     * Proses file Excel dan kembalikan summary hasil import.
     *
     * @return array{
     *   success_count: int,
     *   failure_count: int,
     *   successes: array,
     *   failures: array,
     * }
     */
    public function import(UploadedFile $file, string $schoolUserId): array
    {
        $importer = new StudentImport($schoolUserId);

        Excel::import($importer, $file);

        return [
            'success_count' => $importer->getSuccessCount(),
            'failure_count' => $importer->getFailureCount(),
            'successes' => $importer->getSuccesses(),
            'failures' => $importer->getFailures(),
        ];
    }

    /**
     * Download template Excel kosong untuk diisi Guru BK.
     */
    public function downloadTemplate(): BinaryFileResponse
    {
        return Excel::download(
            new StudentImportTemplateExport,
            'template-import-siswa.xlsx'
        );
    }

    /**
     * Download Excel hasil import berisi email + password siswa baru.
     *
     * @param  array  $successes  Data dari $importer->getSuccesses()
     */
    public function downloadResult(array $successes): BinaryFileResponse
    {
        return Excel::download(
            new StudentImportResultExport($successes),
            'hasil-import-siswa.xlsx'
        );
    }
}
