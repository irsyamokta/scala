<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $instrument_id
 * @property string $type_name
 * @property int $min_age
 * @property int $max_age
 * @property bool $is_baseline
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class InstrumentType extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'instrument_types';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'instrument_id',
        'type_name',
        'min_age',
        'max_age',
        'is_baseline',
    ];

    protected $casts = [
        'is_baseline' => 'boolean',
    ];

    public function instrument()
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'type_id', 'id');
    }
}
