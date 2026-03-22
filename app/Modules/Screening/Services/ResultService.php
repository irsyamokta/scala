<?php

namespace App\Modules\Screening\Services;

use Illuminate\Support\Facades\DB;
use App\Modules\Screening\Repositories\ResultRepository;

class ResultService
{
    public function __construct(
        protected ResultRepository $repo
    ) {}

    public function updateSdq($id, array $data, $user)
    {
        $result = $this->repo->findSdq($id);

        return DB::transaction(function () use ($result, $data, $user) {

            $updated = $this->repo->updateSdq($result, [
                ...$data,
                'psychologist_user_id' => $user->id,
                'date_analysis' => now()
            ]);

            $updated->screening()->update([
                'status' => 'Selesai Dievaluasi'
            ]);

            return $updated;
        });
    }

    public function updateSrq($id, array $data, $user)
    {
        $result = $this->repo->findSrq($id);

        return DB::transaction(function () use ($result, $data, $user) {

            $updated = $this->repo->updateSrq($result, [
                ...$data,
                'psychologist_user_id' => $user->id,
                'date_analysis' => now()
            ]);

            $updated->screening()->update([
                'status' => 'Selesai Dievaluasi'
            ]);

            return $updated;
        });
    }
}
