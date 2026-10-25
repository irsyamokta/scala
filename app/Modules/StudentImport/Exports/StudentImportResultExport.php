<?php

namespace App\Modules\StudentImport\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentImportResultExport implements FromArray, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    private array $rows;

    public function __construct(array $successes)
    {
        $this->rows = $successes;
    }

    public function title(): string
    {
        return 'Hasil Import Siswa';
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama',
            'NIS',
            'Kelas',
            'Status',
        ];
    }

    public function array(): array
    {
        return array_map(function (array $row, int $idx) {
            return [
                $idx + 1,
                $row['name'],
                $row['nis'] ?? '-',
                $row['class'],
                $row['is_new'] ? 'Data Baru' : 'Data Diperbarui',
            ];
        }, $this->rows, array_keys($this->rows));
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Header row: bold + background
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => Color::COLOR_WHITE]],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF0C968D'], // warna brand SCALA
                ],
            ],
        ];
    }
}
