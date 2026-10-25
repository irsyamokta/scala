<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $school_user_id
 * @property string $class_id
 * @property string $instrument_id
 * @property string|null $assigned_psychologist_id
 * @property string $label
 * @property string $access_token
 * @property string $status active|closed
 * @property \Carbon\Carbon|null $expires_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class PinBatch extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'batches';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'school_user_id',
        'class_id',
        'instrument_id',
        'assigned_psychologist_id',
        'label',
        'access_token',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function school()
    {
        return $this->belongsTo(User::class, 'school_user_id', 'id');
    }

    public function class()
    {
        return $this->belongsTo(Clazz::class, 'class_id', 'id');
    }

    public function instrument()
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'id');
    }

    public function assignedPsychologist()
    {
        return $this->belongsTo(User::class, 'assigned_psychologist_id', 'id');
    }

    public function entries()
    {
        return $this->hasMany(StudentPin::class, 'batch_id', 'id');
    }

    /** Cek apakah batch sudah expired berdasarkan expires_at. */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && now()->gt($this->expires_at);
    }

    /** Cek apakah batch masih bisa dipakai oleh siswa. */
    public function isUsable(): bool
    {
        return $this->status === 'active' && ! $this->isExpired();
    }

    /**
     * Auto-close batch jika sudah melewati expires_at.
     * Dipanggil saat batch diakses (lazy close).
     */
    public function autoCloseIfExpired(): void
    {
        if ($this->status === 'active' && $this->isExpired()) {
            $this->update(['status' => 'closed']);
        }
    }
}
