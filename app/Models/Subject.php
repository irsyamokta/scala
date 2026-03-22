<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $name
 * @property string $gender
 * @property int $age
 * @property string $owner_user_id
 * @property string|null $class_id
 * @property bool $is_self
 * @property bool $has_previous_screening
 * @property string|null $last_result
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Subject extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'subjects';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'gender',
        'age',
        'owner_user_id',
        'class_id',
        'is_self',
        'has_previous_screening',
        'last_result',
    ];

    protected $casts = [
        'is_self' => 'boolean',
        'has_previous_screening' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id', 'id');
    }

    public function class()
    {
        return $this->belongsTo(Clazz::class, 'class_id', 'id');
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'subject_id', 'id');
    }
}
