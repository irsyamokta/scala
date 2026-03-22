<?php

namespace App\Modules\Subject\Repositories;

use App\Models\Clazz;

class ClassRepository
{
    public function getAll(string $schoolId)
    {
        return Clazz::withCount('subjects')
            ->where('school_user_id', $schoolId)
            ->get();
    }

    public function find($id)
    {
        return Clazz::findOrFail($id);
    }

    public function existsByName(string $name, string $schoolId)
    {
        return Clazz::where('class_name', $name)
            ->where('school_user_id', $schoolId)
            ->exists();
    }

    public function existsByNameExcept($id, string $name, string $schoolId)
    {
        return Clazz::where('class_name', $name)
            ->where('school_user_id', $schoolId)
            ->where('id', '!=', $id)
            ->exists();
    }

    public function create(array $data)
    {
        return Clazz::create($data);
    }

    public function update(Clazz $class, array $data)
    {
        $class->update($data);
        return $class;
    }

    public function delete(Clazz $class)
    {
        return $class->delete();
    }
}