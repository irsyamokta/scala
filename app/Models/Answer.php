<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $screening_id
 * @property string $question_id
 * @property int $raw_score
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Answer extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'answers';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'screening_id',
        'question_id',
        'raw_score',
    ];

    public function screening()
    {
        return $this->belongsTo(Screening::class, 'screening_id', 'id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }
}
