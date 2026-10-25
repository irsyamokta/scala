<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $instrument_id
 * @property string|null $type_id
 * @property int $question_number
 * @property string $text
 * @property string $domain
 * @property bool $is_reverse_scored
 * @property string $options
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Question extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'questions';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'instrument_id',
        'type_id',
        'question_number',
        'text',
        'domain',
        'is_reverse_scored',
        'options',
    ];

    protected $casts = [
        'is_reverse_scored' => 'boolean',
        'options' => 'array',
    ];

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
        return $this->hasMany(Answer::class, 'question_id', 'id');
    }
}
