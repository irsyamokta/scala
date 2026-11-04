<?php

namespace App\Modules\Batch\Exports;

use App\Models\Batch;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BatchRecapExport implements FromArray, ShouldAutoSize, WithColumnFormatting, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private Batch $batch) {}

    public function title(): string
    {
        return substr('Rekap '.$this->batch->label, 0, 31);
    }

    public function headings(): array
    {
        return [
            'No', 'Nama Siswa', 'NIS', 'Jenis Kelamin', 'Kelas', 'Tanggal Tes',
            'Emotional Symptoms', 'Conduct Problems', 'Hyperactivity',
            'Peer Problems', 'Prosocial Behavior', 'Hasil Akhir',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'G' => NumberFormat::FORMAT_NUMBER,
            'H' => NumberFormat::FORMAT_NUMBER,
            'I' => NumberFormat::FORMAT_NUMBER,
            'J' => NumberFormat::FORMAT_NUMBER,
            'K' => NumberFormat::FORMAT_NUMBER,
        ];
    }

    public function array(): array
    {
        $entries = $this->batch->entries()
            ->with([
                'subject:id,name,nis,gender,class_id',
                'subject.class:id,class_name',
                'screening:id,pin_id,date_taken',
                'screening.sdqResult:id,screening_id,emotional_score,conduct_score,hyperactivity_score,peer_score,prosocial_score,overall_category',
            ])
            ->get();

        return $entries->map(function ($entry, $i) {
            $subject = $entry->subject;
            $screening = $entry->screening;
            $sdq = $screening?->sdqResult;

            $gender = match ($subject?->gender) {
                'male' => 'Laki-laki',
                'female' => 'Perempuan',
                default => '-',
            };

            return [
                $i + 1,
                $subject?->name ?? '-',
                $subject?->nis ?? '-',
                $gender,
                $subject?->class?->class_name ?? '-',
                $screening?->date_taken ? $screening->date_taken->format('d/m/Y') : 'Belum tes',
                $sdq !== null ? (int) $sdq->emotional_score : null,
                $sdq !== null ? (int) $sdq->conduct_score : null,
                $sdq !== null ? (int) $sdq->hyperactivity_score : null,
                $sdq !== null ? (int) $sdq->peer_score : null,
                $sdq !== null ? (int) $sdq->prosocial_score : null,
                $sdq?->overall_category ?? '-',
            ];
        })->toArray();
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
