<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $screening_id
 * @property string $psychologist_user_id
 * @property int|null $gme_score
 * @property string|null $gme_note
 * @property bool|null $gme_indication
 * @property bool|null $substance_use_indication
 * @property bool|null $substance_use_note
 * @property bool|null $psychotic_symptom_indication
 * @property bool|null $psychotic_symptom_note
 * @property bool|null $ptsd_symptom_indication
 * @property bool|null $ptsd_symptom_note
 * @property string|null $psychologist_note
 * @property string|null $recommendation
 * @property \Carbon\Carbon $date_analysis
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class SrqResult extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'srq_results';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'screening_id',
        'psychologist_user_id',

        'gme_score',

        'gme_indication',
        'gme_note',

        'substance_use_indication',
        'substance_use_note',

        'psychotic_symptom_indication',
        'psychotic_symptom_note',

        'ptsd_symptom_indication',
        'ptsd_symptom_note',

        'psychologist_note',

        'recommendation',
        'date_analysis',
    ];

    protected $casts = [
        'gme_indication' => 'boolean',
        'substance_use_indication' => 'boolean',
        'psychotic_symptom_indication' => 'boolean',
        'ptsd_symptom_indication' => 'boolean',
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
