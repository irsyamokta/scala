<?php

namespace App\Modules\Screening\Repositories;

use App\Models\Answer;
use Illuminate\Support\Str;

class AnswerRepository
{
    public function insertMany(array $data)
    {
        foreach ($data as &$row) {
            $row['id'] = Str::uuid();
        }

        return Answer::insert($data);
    }
}
