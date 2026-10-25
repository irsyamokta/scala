<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $subject_id
 * @property string $reporter_user_id
 * @property string $instrument_id
 * @property string $type_id
 * @property string|null $pin_id
 * @property \Carbon\Carbon $date_taken
 * @property string $status
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Screening extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'screenings';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'subject_id',
        'reporter_user_id',
        'instrument_id',
        'type_id',
        'pin_id',
        'date_taken',
        'status',
    ];

    protected $casts = [
        'date_taken' => 'datetime',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_user_id', 'id');
    }

    public function instrument()
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'id');
    }

    public function instrumentType()
    {
        return $this->belongsTo(InstrumentType::class, 'type_id', 'id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'screening_id', 'id');
    }

    public function sdqResult()
    {
        return $this->hasOne(SdqResult::class, 'screening_id', 'id');
    }

    public function srqResult()
    {
        return $this->hasOne(SrqResult::class, 'screening_id', 'id');
    }

    public function studentPin()
    {
        return $this->belongsTo(StudentPin::class, 'pin_id', 'id');
    }
}
