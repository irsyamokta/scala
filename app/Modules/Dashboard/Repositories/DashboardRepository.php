<?php

namespace App\Modules\Dashboard\Repositories;

use App\Models\Screening;
use App\Models\Subject;
use App\Models\Clazz;
use App\Models\SdqResult;
use App\Models\SrqResult;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardRepository
{
    // Superadmin & Psychologist

    public function countByStatus(string $status)
    {
        return Screening::where('status', $status)->count();
    }

    public function countToday()
    {
        return Screening::whereDate('created_at', today())->count();
    }

    public function weeklyScreeningByMonth(string $month)
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end = Carbon::parse($month)->endOfMonth();

        return Screening::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('
            WEEK(created_at, 1) - WEEK(?, 1) + 1 as week,
            COUNT(*) as total
        ', [$start])
            ->groupBy('week')
            ->orderBy('week')
            ->get();
    }

    public function categoryDistribution(?string $week = null)
    {
        $start = null;
        $end = null;

        if ($week && str_contains($week, '|')) {
            [$startDate, $endDate] = explode('|', $week);

            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();
        }

        // SDQ
        $sdq = SdqResult::query()
            ->when($start && $end, fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->selectRaw('overall_category, COUNT(*) as total')
            ->groupBy('overall_category')
            ->pluck('total', 'overall_category')
            ->toArray();

        // SRQ
        $srq = SrqResult::query()
            ->when($start && $end, fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->selectRaw('
            CASE
                WHEN gme_indication = 1
                  OR substance_use_indication = 1
                  OR psychotic_symptom_indication = 1
                  OR ptsd_symptom_indication = 1
                THEN "Terindikasi"
                ELSE "Tidak Terindikasi"
            END as category,
            COUNT(*) as total
        ')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        return [
            'Normal' => $sdq['Normal'] ?? 0,
            'Borderline' => $sdq['Borderline'] ?? 0,
            'Abnormal' => $sdq['Abnormal'] ?? 0,
            'Terindikasi' => $srq['Terindikasi'] ?? 0,
            'Tidak Terindikasi' => $srq['Tidak Terindikasi'] ?? 0,
        ];
    }

    public function instrumentComparison()
    {
        return [
            'SDQ' => SdqResult::count(),
            'SRQ' => SrqResult::count(),
        ];
    }

    public function instrumentComparisonByPsychologist($userId)
    {
        return [
            'SDQ' => SdqResult::where('psychologist_user_id', $userId)->count(),
            'SRQ' => SrqResult::where('psychologist_user_id', $userId)->count(),
        ];
    }

    public function pendingScreenings()
    {
        return Screening::with('subject')
            ->where('status', 'Menunggu Evaluasi')
            ->latest()
            ->get();
    }

    public function latestScreeningsForPsychologist(int $limit = 5)
    {
        return Screening::with(['subject', 'instrument', 'instrumentType'])
            ->latest('date_taken')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->subject->name ?? '-',
                    'instrument' => $item->instrument->name ?? '-',
                    'type' => $item->instrumentType->type_name ?? '-',
                    'date' => optional($item->date_taken)->format('Y-m-d'),
                    'status' => $item->status,
                ];
            });
    }

    // Parent

    public function parentSubjects($userId)
    {
        return Subject::where('owner_user_id', $userId)->get();
    }

    public function subjectCategoryTrend($subjectId)
    {
        $screenings = Screening::with(['sdqResult', 'srqResult'])
            ->where('subject_id', $subjectId)
            ->orderBy('date_taken')
            ->get();

        $result = [];

        foreach ($screenings as $item) {
            $month = Carbon::parse($item->date_taken)->format('M');

            if (!isset($result[$month])) {
                $result[$month] = [
                    'Normal' => 0,
                    'Borderline' => 0,
                    'Abnormal' => 0,
                    'Terindikasi' => 0,
                    'Tidak Terindikasi' => 0,
                ];
            }

            // SDQ
            if ($item->sdqResult) {
                $category = $item->sdqResult->overall_category;
                $result[$month][$category]++;
            }

            // SRQ
            if ($item->srqResult) {
                $isIndicated =
                    $item->srqResult->gme_indication ||
                    $item->srqResult->substance_use_indication ||
                    $item->srqResult->psychotic_symptom_indication ||
                    $item->srqResult->ptsd_symptom_indication;

                $category = $isIndicated ? 'Terindikasi' : 'Tidak Terindikasi';

                $result[$month][$category]++;
            }
        }

        return $result;
    }

    public function latestResults($userId)
    {
        return Screening::with(['subject', 'sdqResult', 'srqResult'])
            ->whereHas('subject', fn($q) => $q->where('owner_user_id', $userId))
            ->latest('date_taken')
            ->limit(4)
            ->get()
            ->map(function ($item) {

                $category = null;

                if ($item->sdqResult) {
                    $category = $item->sdqResult->overall_category;
                }

                if ($item->srqResult) {
                    $isIndicated =
                        $item->srqResult->gme_indication ||
                        $item->srqResult->substance_use_indication ||
                        $item->srqResult->psychotic_symptom_indication ||
                        $item->srqResult->ptsd_symptom_indication;

                    $category = $isIndicated ? 'Terindikasi' : 'Tidak Terindikasi';
                }

                return [
                    'name' => $item->subject->name ?? '-',
                    'date' => optional($item->date_taken)->format('Y-m-d'),
                    'category' => $category,
                ];
            });
    }

    // School

    public function totalStudents($userId)
    {
        return Subject::where([
            ['owner_user_id', '=', $userId],
            ['is_self', '=', false],
        ])->count();
    }

    public function totalClasses($userId)
    {
        return Clazz::where('school_user_id', $userId)->count();
    }

    public function schoolChart($userId, string $month, $class = null)
    {
        $monthNumber = Carbon::parse($month)->month;

        $categories = [
            'Normal',
            'Borderline',
            'Abnormal',
            'Terindikasi',
            'Tidak Terindikasi',
        ];

        $result = array_fill_keys($categories, 0);

        $screenings = Screening::with([
            'subject.class',
            'sdqResult',
            'srqResult',
        ])
            ->whereHas('subject.class', function ($q) use ($userId, $class) {
                $q->where('school_user_id', $userId);

                if ($class && $class !== 'all') {
                    $q->where('class_name', $class);
                }
            })
            ->whereMonth('created_at', $monthNumber)
            ->get();

        foreach ($screenings as $item) {
            if (!$item->subject || !$item->subject->class) continue;

            // SDQ
            if ($item->sdqResult) {
                $category = $item->sdqResult->overall_category;
                if (isset($result[$category])) {
                    $result[$category]++;
                }
            }

            // SRQ
            if ($item->srqResult) {
                $isIndicated =
                    $item->srqResult->gme_indication ||
                    $item->srqResult->substance_use_indication ||
                    $item->srqResult->psychotic_symptom_indication ||
                    $item->srqResult->ptsd_symptom_indication;

                $category = $isIndicated
                    ? 'Terindikasi'
                    : 'Tidak Terindikasi';

                $result[$category]++;
            }
        }

        return [
            'labels' => array_keys($result),
            'series' => [
                [
                    'name' => 'Jumlah Siswa',
                    'data' => array_values($result),
                ]
            ],
        ];
    }

    // General

    public function selfSubject($userId)
    {
        return Subject::where('owner_user_id', $userId)
            ->where('is_self', true)
            ->first();
    }

    public function totalScreeningBySubject($subjectId)
    {
        return Screening::where('subject_id', $subjectId)->count();
    }

    public function lastScreening($subjectId)
    {
        $item = Screening::with('sdqResult', 'srqResult')
            ->where('subject_id', $subjectId)
            ->latest('date_taken')
            ->first();

        if (!$item) return null;

        $category = null;

        if ($item->sdqResult) {
            $category = $item->sdqResult->overall_category;
        }

        if ($item->srqResult) {
            $isIndicated =
                $item->srqResult->gme_indication ||
                $item->srqResult->substance_use_indication ||
                $item->srqResult->psychotic_symptom_indication ||
                $item->srqResult->ptsd_symptom_indication;

            $category = $isIndicated ? 'Terindikasi' : 'Tidak Terindikasi';
        }

        return [
            'date' => optional($item->date_taken)->format('Y-m-d'),
            'category' => $category,
        ];
    }
}
