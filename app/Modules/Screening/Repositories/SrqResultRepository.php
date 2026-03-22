<?php

namespace App\Modules\Screening\Repositories;

use App\Models\SrqResult;

class SrqResultRepository
{
    public function create(array $data)
    {
        return SrqResult::create($data);
    }
}