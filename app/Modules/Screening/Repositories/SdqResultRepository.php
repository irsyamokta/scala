<?php

namespace App\Modules\Screening\Repositories;

use App\Models\SdqResult;

class SdqResultRepository
{
    public function create(array $data)
    {
        return SdqResult::create($data);
    }
}