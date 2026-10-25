<?php

namespace App\Modules\Subject\Services;

use App\Modules\Subject\Repositories\ClassRepository;
use DomainException;
use Illuminate\Support\Facades\DB;

class ClassService
{
    public function __construct(
        protected ClassRepository $repo
    ) {}

    public function getClasses(string $schoolId)
    {
        return $this->repo->getAll($schoolId);
    }

    public function createClass(array $data)
    {
        if ($this->repo->existsByName(
            $data['class_name'],
            $data['school_user_id']
        )) {
            throw new DomainException('Nama kelas sudah ada');
        }

        return DB::transaction(function () use ($data) {
            return $this->repo->create($data);
        });
    }

    public function updateClass($id, array $data)
    {
        $class = $this->repo->find($id);

        if (
            isset($data['class_name']) &&
            $this->repo->existsByNameExcept(
                $id,
                $data['class_name'],
                $class->school_user_id
            )
        ) {
            throw new DomainException('Nama kelas sudah ada');
        }

        return $this->repo->update($class, $data);
    }

    public function deleteClass($id)
    {
        $class = $this->repo->find($id);

        if ($class->subjects()->count() > 0) {
            throw new DomainException('Kelas masih memiliki siswa');
        }

        return $this->repo->delete($class);
    }
}
