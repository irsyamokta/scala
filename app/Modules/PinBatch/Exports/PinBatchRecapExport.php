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

class PinBatchRecapExport implements FromArray, ShouldAutoSize, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private PinBatch $batch) {}

    public function title(): string
    {
        return substr('Rekap '.$this->batch->label, 0, 31);
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Siswa',
            'NIS',
            'Jenis Kelamin',
            'Kelas',
            'Tanggal Tes',
            'Emotional Symptoms',
            'Conduct Problems',
            'Hyperactivity',
            'Peer Problems',
            'Prosocial Behavior',
            'Hasil Akhir',
        ];
    }

    public function array(): array
    {
        $pins = $this->batch->studentPins()
            ->with([
                'subject:id,name,nis,gender,class_id',
                'subject.class:id,class_name',
                'screening:id,pin_id,date_taken',
                'screening.sdqResult:id,screening_id,emotional_score,conduct_score,hyperactivity_score,peer_score,prosocial_score,overall_category',
            ])
            ->get();

        return $pins->map(function ($pin, $i) {
            $subject = $pin->subject;
            $screening = $pin->screening;
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
                $screening?->date_taken
                    ? $screening->date_taken->format('d/m/Y')
                    : 'Belum tes',
                // Gunakan null coalescing dengan 0 sebagai fallback, bukan '-'
                $sdq !== null ? (int) $sdq->emotional_score : '-',
                $sdq !== null ? (int) $sdq->conduct_score : '-',
                $sdq !== null ? (int) $sdq->hyperactivity_score : '-',
                $sdq !== null ? (int) $sdq->peer_score : '-',
                $sdq !== null ? (int) $sdq->prosocial_score : '-',
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
