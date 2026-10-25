<?php

namespace App\Modules\StudentImport\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentImportTemplateExport implements FromArray, ShouldAutoSize, WithColumnWidths, WithHeadings, WithStyles, WithTitle
{
    public function title(): string
    {
        return 'Template Import Siswa';
    }

    public function headings(): array
    {
        return ['nama', 'nis', 'jenis_kelamin', 'tanggal_lahir', 'kelas'];
    }

    /**
     * Contoh baris agar Guru BK paham format yang diharapkan.
     * tanggal_lahir format: YYYY-MM-DD
     */
    public function array(): array
    {
        return [
            ['Budi Santoso',  '2024001', 'L', '2010-05-12', '9A'],
            ['Siti Rahayu',   '2024002', 'P', '2009-11-30', '9A'],
            ['Ahmad Fauzi',   '2024003', 'L', '2011-03-07', '8B'],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 30, // nama
            'B' => 15, // nis
            'C' => 15, // jenis_kelamin
            'D' => 18, // tanggal_lahir
            'E' => 15, // kelas
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => Color::COLOR_WHITE]],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF0C968D'],
                ],
            ],
        ];
    }
}
