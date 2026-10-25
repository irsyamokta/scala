<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $class_name
 * @property string $school_user_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Clazz extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'classes';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'class_name',
        'school_user_id',
    ];

    public function school()
    {
        return $this->belongsTo(User::class, 'school_user_id', 'id');
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'class_id', 'id');
    }
}
