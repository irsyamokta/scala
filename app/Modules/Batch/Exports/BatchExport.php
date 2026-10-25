<?php

namespace App\Modules\Batch\Exports;

use App\Models\Batch;
use App\Models\Subject;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BatchExport implements FromArray, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private Batch $batch) {}

    public function title(): string
    {
        return substr($this->batch->label, 0, 31);
    }

    public function headings(): array
    {
        return ['No', 'Nama Siswa', 'NIS', 'Kelas', 'Status Tes'];
    }

    public function array(): array
    {
        $doneSubjectIds = $this->batch->entries()->pluck('subject_id');

        $query = Subject::with('class:id,class_name')
            ->where('owner_user_id', $this->batch->school_user_id)
            ->where('is_self', false);

        if ($this->batch->class_id) {
            $query->where('class_id', $this->batch->class_id);
        }

        return $query->orderBy('name')
            ->get()
            ->map(function ($subject, $i) use ($doneSubjectIds) {
                return [
                    $i + 1,
                    $subject->name,
                    $subject->nis ?? '-',
                    $subject->class?->class_name ?? '-',
                    $doneSubjectIds->contains($subject->id) ? 'Sudah Tes' : 'Belum Tes',
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
