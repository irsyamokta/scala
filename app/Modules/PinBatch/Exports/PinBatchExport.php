<?php

namespace App\Modules\PinBatch\Exports;

use App\Models\PinBatch;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PinBatchExport implements FromArray, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private PinBatch $batch) {}

    public function title(): string
    {
        return substr($this->batch->label, 0, 31); // Max 31 chars untuk sheet name
    }

    public function headings(): array
    {
        return ['No', 'Nama Siswa', 'NIS', 'Kelas', 'PIN', 'Status'];
    }

    public function array(): array
    {
        return $this->batch->studentPins()
            ->with('subject:id,name,nis,class_id', 'subject.class:id,class_name')
            ->get()
            ->map(function ($pin, $i) {
                return [
                    $i + 1,
                    $pin->subject?->name ?? '-',
                    $pin->subject?->nis ?? '-',
                    $pin->subject?->class?->class_name ?? '-',
                    $pin->pin_code,
                    $pin->used_at ? 'Terpakai' : 'Belum Dipakai',
                ];
            })
            ->toArray();
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
