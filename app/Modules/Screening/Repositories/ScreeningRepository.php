<?php

namespace App\Modules\Screening\Repositories;

use App\Models\Screening;

class ScreeningRepository
{
    public function getAll(?string $search = null, ?array $categories = null)
    {
        return $this->baseQuery($search, $categories)->get();
    }

    public function getPaginated(?string $search = null, ?array $categories = null, int $perPage = 10)
    {
        return $this->baseQuery($search, $categories)
            ->orderByDesc('date_taken')
            ->paginate($perPage)
            ->withQueryString();
    }

    private function baseQuery(?string $search, ?array $categories = null)
    {
        return Screening::query()
            ->with([
                'subject:id,name,age',
                'reporter:id,name',
                'instrument:id,name',
                'instrumentType:id,type_name',
                'sdqResult.psychologist:id,name',
                'srqResult.psychologist:id,name',
            ])

            ->when($search, function ($query) use ($search) {
                $query->whereHas('subject', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })

            ->when($categories, function ($query) use ($categories) {

                $sdqCategories = array_intersect(
                    $categories,
                    ['Normal', 'Borderline', 'Abnormal']
                );

                $srqCategories = array_intersect(
                    $categories,
                    ['Terindikasi', 'Tidak Terindikasi']
                );

                $query->where(function ($q) use ($sdqCategories, $srqCategories) {

                    if (! empty($sdqCategories)) {
                        $q->whereHas('sdqResult', function ($sdq) use ($sdqCategories) {
                            $sdq->whereIn('overall_category', $sdqCategories);
                        });
                    }

                    if (! empty($srqCategories)) {

                        $q->orWhereHas('srqResult', function ($srq) use ($srqCategories) {

                            $values = [];

                            if (in_array('Terindikasi', $srqCategories)) {
                                $values[] = true;
                            }

                            if (in_array('Tidak Terindikasi', $srqCategories)) {
                                $values[] = false;
                            }

                            $srq->whereIn('gme_indication', $values);
                        });
                    }
                });
            });
    }

    public function find($id)
    {
        return Screening::with([
            'subject',
            'reporter',
            'instrument',
            'instrumentType',
            'answers',
            'sdqResult',
            'srqResult',
        ])->findOrFail($id);
    }

    public function getLastCompleted($subjectId, $instrumentId)
    {
        return Screening::where('subject_id', $subjectId)
            ->where('instrument_id', $instrumentId)
            ->where('status', 'Menunggu Evaluasi')
            ->latest('date_taken')
            ->first();
    }

    public function create(array $data)
    {
        return Screening::create($data);
    }
}
