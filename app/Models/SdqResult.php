<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $screening_id
 * @property string $psychologist_user_id
 * @property int|null $emotional_score
 * @property string|null $emotional_note
 * @property int|null $conduct_score
 * @property string|null $conduct_note
 * @property int|null $hyperactivity_score
 * @property string|null $hyperactivity_note
 * @property int|null $peer_score
 * @property string|null $peer_note
 * @property int|null $prosocial_score
 * @property string|null $prosocial_note
 * @property int|null $total_difficulties
 * @property string $overall_category
 * @property string|null $recommendation
 * @property \Carbon\Carbon $date_analysis
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class SdqResult extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'sdq_results';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'screening_id',
        'psychologist_user_id',

        'emotional_score',
        'emotional_note',

        'conduct_score',
        'conduct_note',

        'hyperactivity_score',
        'hyperactivity_note',

        'peer_score',
        'peer_note',

        'prosocial_score',
        'prosocial_note',

        'total_difficulties',
        'overall_category',
        'recommendation',

        'date_analysis',
    ];

    public function screening()
    {
        return $this->belongsTo(Screening::class, 'screening_id', 'id');
    }

    public function psychologist()
    {
        return $this->belongsTo(User::class, 'psychologist_user_id', 'id');
    }
}
