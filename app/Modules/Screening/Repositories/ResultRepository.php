<?php

namespace App\Modules\Screening\Repositories;

use App\Models\SdqResult;
use App\Models\SrqResult;

class ResultRepository
{
    public function findSdq($id)
    {
        return SdqResult::findOrFail($id);
    }

    public function findSrq($id)
    {
        return SrqResult::findOrFail($id);
    }

    public function updateSdq(SdqResult $result, array $data)
    {
        $result->update($data);
        return $result;
    }

    public function updateSrq(SrqResult $result, array $data)
    {
        $result->update($data);
        return $result;
    }
}
