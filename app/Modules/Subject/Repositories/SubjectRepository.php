<?php

namespace App\Modules\Subject\Repositories;

use App\Models\Subject;
use App\Models\Screening;

class SubjectRepository
{
    public function getAll(
        string $ownerId,
        string $role,
        ?string $search = null,
        ?array $genders = null,
        ?array $classIds = null
    ) {
        return $this->baseQuery($ownerId, $role, $search, $genders, $classIds)->get();
    }

    private function baseQuery(
        string $ownerId,
        string $role,
        ?string $search,
        ?array $genders,
        ?array $classIds
    ) {
        return Subject::query()
            ->with('class')
            ->where('owner_user_id', $ownerId)

            ->when($role === 'school', function ($q) {
                $q->whereNotNull('class_id');
            })

            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })

            ->when($genders, function ($q) use ($genders) {
                $q->whereIn('gender', $genders);
            })

            ->when($classIds, function ($q) use ($classIds) {
                $q->whereIn('class_id', $classIds);
            });
    }

    public function getScreenings(string $subjectId)
    {
        return Screening::query()
            ->with([
                'subject:id,name',
                'reporter:id,name,role',
                'instrument:id,name',
                'instrumentType:id,type_name',
                'sdqResult.psychologist:id,name',
                'srqResult.psychologist:id,name',
            ])
            ->where('subject_id', $subjectId)
            ->latest('date_taken')
            ->get();
    }

    public function find($id)
    {
        return Subject::findOrFail($id);
    }

    public function existsByName(string $name, string $ownerId)
    {
        return Subject::where('name', $name)
            ->where('owner_user_id', $ownerId)
            ->exists();
    }

    public function existsByNameExcept($id, string $name, string $ownerId)
    {
        return Subject::where('name', $name)
            ->where('owner_user_id', $ownerId)
            ->where('id', '!=', $id)
            ->exists();
    }

    public function create(array $data)
    {
        return Subject::create($data);
    }

    public function update(Subject $subject, array $data)
    {
        $subject->update($data);
        return $subject;
    }

    public function delete(Subject $subject)
    {
        return $subject->delete();
    }
}
