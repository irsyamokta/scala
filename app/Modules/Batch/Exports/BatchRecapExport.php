<?php

namespace App\Modules\Batch\Exports;

use App\Models\Batch;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BatchRecapExport extends DefaultValueBinder implements FromArray, ShouldAutoSize, WithColumnFormatting, WithCustomValueBinder, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private Batch $batch) {}

    public function bindValue(Cell $cell, mixed $value): bool
    {
        if (is_int($value)) {
            $cell->setValueExplicit($value, DataType::TYPE_NUMERIC);
            return true;
        }

        return parent::bindValue($cell, $value);
    }

    public function title(): string
    {
        return substr('Rekap '.$this->batch->label, 0, 31);
    }

    public function headings(): array
    {
        return [
            'No', 'Nama Siswa', 'Tanggal Lahir', 'NIS', 'Jenis Kelamin', 'Kelas', 'Tanggal Tes',
            'Emotional Symptoms', 'Conduct Problems', 'Hyperactivity',
            'Peer Problems', 'Prosocial Behavior', 'Hasil Akhir',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'H' => NumberFormat::FORMAT_NUMBER,
            'I' => NumberFormat::FORMAT_NUMBER,
            'J' => NumberFormat::FORMAT_NUMBER,
            'K' => NumberFormat::FORMAT_NUMBER,
            'L' => NumberFormat::FORMAT_NUMBER,
        ];
    }

    public function array(): array
    {
        $entries = $this->batch->entries()
            ->with([
                'subject:id,name,nis,gender,class_id,tanggal_lahir',
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

            $tanggalLahir = $subject?->tanggal_lahir
                ? \Carbon\Carbon::parse($subject->tanggal_lahir)->format('d/m/Y')
                : '-';

            $dateTaken = $screening?->date_taken
                ? \Carbon\Carbon::parse($screening->date_taken)->setTimezone(config('app.timezone', 'Asia/Jakarta'))->format('d/m/Y - H:i:s')
                : 'Belum tes';

            return [
                $i + 1,
                $subject?->name ?? '-',
                $tanggalLahir,
                $subject?->nis ?? '-',
                $gender,
                $subject?->class?->class_name ?? '-',
                $dateTaken,
                $sdq !== null ? (int) $sdq->emotional_score : '',
                $sdq !== null ? (int) $sdq->conduct_score : '',
                $sdq !== null ? (int) $sdq->hyperactivity_score : '',
                $sdq !== null ? (int) $sdq->peer_score : '',
                $sdq !== null ? (int) $sdq->prosocial_score : '',
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
