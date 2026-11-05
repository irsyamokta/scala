<?php

namespace App\Modules\Subject\Services;

use App\Modules\Subject\Repositories\ClassRepository;
use App\Modules\Subject\Repositories\SubjectRepository;
use Carbon\Carbon;
use DomainException;
use Illuminate\Support\Facades\DB;

class SubjectService
{
    public function __construct(
        protected SubjectRepository $repo,
        protected ClassRepository $classRepo
    ) {}

    public function getSubjects(
        string $ownerId,
        string $role,
        ?string $search = null,
        ?array $genders = null,
        ?array $classIds = null
    ) {
        return $this->repo->getAll($ownerId, $role, $search, $genders, $classIds);
    }

    public function getPaginatedSubjects(
        string $ownerId,
        string $role,
        ?string $search = null,
        ?array $genders = null,
        ?array $classIds = null,
        int $perPage = 10
    ) {
        return $this->repo->getPaginated($ownerId, $role, $search, $genders, $classIds, $perPage);
    }

    public function getSubjectScreenings(string $subjectId)
    {
        return $this->repo->getScreenings($subjectId);
    }

    public function findSubject($id)
    {
        return $this->repo->find($id);
    }

    public function createSubject(array $data, string $role)
    {
        if ($this->repo->existsByName($data['name'], $data['owner_user_id'])) {
            throw new DomainException('Nama tersebut sudah ada');
        }

        if ($role === 'school') {
            if (empty($data['class_id'])) {
                throw new DomainException('Kelas wajib dipilih');
            }

            $this->classRepo->find($data['class_id']);
        }

        if (! empty($data['tanggal_lahir'])) {
            $data['age'] = (int) Carbon::parse($data['tanggal_lahir'])->age;
        }

        return DB::transaction(function () use ($data) {
            return $this->repo->create($data);
        });
    }

    public function updateSubject($id, array $data)
    {
        $subject = $this->repo->find($id);

        if (
            isset($data['name']) &&
            $this->repo->existsByNameExcept(
                $id,
                $data['name'],
                $subject->owner_user_id
            )
        ) {
            throw new DomainException('Nama tersebut sudah ada');
        }

        if (! empty($data['tanggal_lahir'])) {
            $data['age'] = (int) Carbon::parse($data['tanggal_lahir'])->age;
        }

        return $this->repo->update($subject, $data);
    }

    public function deleteSubject($id)
    {
        $subject = $this->repo->find($id);

        if ($subject->is_self) {
            throw new DomainException('Anda tidak dapat menghapus diri sendiri');
        }

        return $this->repo->delete($subject);
    }
}
