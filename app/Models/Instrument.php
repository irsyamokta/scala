<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Instrument extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'instruments';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
    ];

    public function instrumentTypes()
    {
        return $this->hasMany(InstrumentType::class, 'instrument_id', 'id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'instrument_id', 'id');
    }
}
