<?php

namespace App\Modules\StudentImport\Imports;

use App\Models\Clazz;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class StudentImport implements SkipsEmptyRows, SkipsOnError, SkipsOnFailure, ToModel, WithBatchInserts, WithChunkReading, WithHeadingRow, WithValidation
{
    private string $schoolUserId;

    private array $successes = [];

    private array $failures = [];

    private array $errors = [];

    private int $currentRow = 1;

    public function __construct(string $schoolUserId)
    {
        $this->schoolUserId = $schoolUserId;
    }

    public function model(array $row): null
    {
        $this->currentRow++;

        $namaRow = trim((string) $row['nama']);
        $nisRow = trim((string) ($row['nis'] ?? ''));
        $genderRaw = strtoupper(trim((string) $row['jenis_kelamin']));
        $gender = $genderRaw === 'L' ? 'male' : 'female';
        $tanggalLahir = trim((string) $row['tanggal_lahir']);
        $className = trim((string) $row['kelas']);

        try {
            $birthDate = Carbon::parse($tanggalLahir);
            $age = (int) $birthDate->age;
        } catch (\Throwable $e) {
            $this->failures[] = [
                'row' => $this->currentRow,
                'name' => $namaRow,
                'errors' => ["Format tanggal lahir tidak valid: '{$tanggalLahir}'. Gunakan format YYYY-MM-DD."],
            ];

            return null;
        }

        $class = Clazz::firstOrCreate([
            'class_name' => $className,
            'school_user_id' => $this->schoolUserId,
        ]);

        DB::transaction(function () use ($namaRow, $nisRow, $gender, $age, $tanggalLahir, $class) {
            if ($nisRow !== '') {
                $existing = Subject::where('owner_user_id', $this->schoolUserId)
                    ->where('nis', $nisRow)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'name' => $namaRow,
                        'gender' => $gender,
                        'age' => $age,
                        'tanggal_lahir' => $tanggalLahir,
                        'class_id' => $class->id,
                    ]);

                    $this->successes[] = [
                        'row' => $this->currentRow,
                        'name' => $namaRow,
                        'nis' => $nisRow,
                        'class' => $class->class_name,
                        'is_new' => false,
                    ];

                    return;
                }
            }

            Subject::create([
                'owner_user_id' => $this->schoolUserId,
                'class_id' => $class->id,
                'is_self' => false,
                'name' => $namaRow,
                'nis' => $nisRow !== '' ? $nisRow : null,
                'gender' => $gender,
                'age' => $age,
                'tanggal_lahir' => $tanggalLahir,
            ]);

            $this->successes[] = [
                'row' => $this->currentRow,
                'name' => $namaRow,
                'nis' => $nisRow,
                'class' => $class->class_name,
                'is_new' => true,
            ];
        });

        return null;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:100',
            'nis' => 'nullable|max:20',
            'jenis_kelamin' => 'required|in:L,P,l,p',
            'tanggal_lahir' => 'required|date',
            'kelas' => 'required|string|max:50',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nama.required' => 'Kolom nama wajib diisi.',
            'jenis_kelamin.required' => 'Kolom jenis_kelamin wajib diisi.',
            'jenis_kelamin.in' => 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan).',
            'tanggal_lahir.required' => 'Kolom tanggal_lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid. Gunakan YYYY-MM-DD.',
            'kelas.required' => 'Kolom kelas wajib diisi.',
        ];
    }

    public function onError(Throwable $e): void
    {
        $this->errors[] = [
            'row' => $this->currentRow,
            'name' => '-',
            'errors' => [$e->getMessage()],
        ];
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->failures[] = [
                'row' => $failure->row(),
                'name' => $failure->values()['nama'] ?? '-',
                'errors' => $failure->errors(),
            ];
        }
    }

    public function batchSize(): int
    {
        return 50;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function getSuccesses(): array
    {
        return $this->successes;
    }

    public function getFailures(): array
    {
        return array_merge($this->failures, $this->errors);
    }

    public function getSuccessCount(): int
    {
        return count($this->successes);
    }

    public function getFailureCount(): int
    {
        return count($this->getFailures());
    }
}
