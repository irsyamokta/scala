<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string $domicile
 * @property string $contact
 * @property string $objective
 * @property string|null $school_name
 * @property string|null $school_level
 * @property string|null $school_address
 * @property string|null $screening_scope
 * @property string|null $onboarding_completed_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, HasUuids, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = 'users';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'domicile',
        'contact',
        'objective',
        'school_name',
        'school_level',
        'school_address',
        'screening_scope',
        'onboarding_completed_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function classes()
    {
        return $this->hasMany(Clazz::class, 'school_user_id', 'id');
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'owner_user_id', 'id');
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'reporter_user_id', 'id');
    }

    public function selfSubject()
    {
        return $this->hasOne(Subject::class, 'owner_user_id', 'id')
            ->where('is_self', true);
    }

    public function childSubjects()
    {
        return $this->hasMany(Subject::class, 'owner_user_id', 'id')
            ->where('is_self', false);
    }

    // Relasi khusus role school: Batch PIN yang dibuat Guru BK
    public function pinBatches()
    {
        return $this->hasMany(PinBatch::class, 'school_user_id', 'id');
    }
}
