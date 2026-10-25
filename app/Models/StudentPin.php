<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $batch_id
 * @property string $subject_id
 * @property string $pin_code
 * @property \Carbon\Carbon|null $used_at
 * @property string|null $screening_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class StudentPin extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'student_pins';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'batch_id',
        'subject_id',
        'pin_code',
        'used_at',
        'screening_id',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];

    public function batch()
    {
        return $this->belongsTo(PinBatch::class, 'batch_id', 'id');
    }

    /** Data siswa (Subject) */
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class, 'screening_id', 'id');
    }

    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }

    public function isValid(): bool
    {
        return ! $this->isUsed() && $this->batch->isUsable();
    }
}
