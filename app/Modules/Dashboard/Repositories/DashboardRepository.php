<?php

namespace App\Modules\Dashboard\Repositories;

use App\Models\Clazz;
use App\Models\Screening;
use App\Models\SdqResult;
use App\Models\SrqResult;
use App\Models\Subject;
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
            ->when($start && $end, fn ($q) => $q->whereBetween('created_at', [$start, $end]))
            ->selectRaw('overall_category, COUNT(*) as total')
            ->groupBy('overall_category')
            ->pluck('total', 'overall_category')
            ->toArray();

        // SRQ
        $srq = SrqResult::query()
            ->when($start && $end, fn ($q) => $q->whereBetween('created_at', [$start, $end]))
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
        return Screening::with([
            'subject:id,name',
            'instrument:id,name',
            'instrumentType:id,type_name',
        ])
            ->select('id', 'subject_id', 'instrument_id', 'type_id', 'date_taken', 'status')
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

            if (! isset($result[$month])) {
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
        return Screening::with([
            'subject:id,name,owner_user_id',
            'sdqResult:id,screening_id,overall_category',
            'srqResult:id,screening_id,gme_indication,substance_use_indication,psychotic_symptom_indication,ptsd_symptom_indication',
        ])
            ->select('id', 'subject_id', 'date_taken')
            ->whereHas('subject', fn ($q) => $q->where('owner_user_id', $userId))
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
        $start = Carbon::parse($month)->startOfMonth();
        $end = Carbon::parse($month)->endOfMonth();

        $screeningQuery = Screening::query()
            ->join('subjects', 'subjects.id', '=', 'screenings.subject_id')
            ->join('classes', 'classes.id', '=', 'subjects.class_id')
            ->where('classes.school_user_id', $userId)
            ->whereBetween('screenings.created_at', [$start, $end]);

        if ($class && $class !== 'all') {
            $screeningQuery->where('classes.class_name', $class);
        }

        $sdqCounts = (clone $screeningQuery)
            ->join('sdq_results', 'sdq_results.screening_id', '=', 'screenings.id')
            ->selectRaw('sdq_results.overall_category, COUNT(*) as total')
            ->groupBy('sdq_results.overall_category')
            ->pluck('total', 'overall_category')
            ->toArray();

        $srqCounts = (clone $screeningQuery)
            ->join('srq_results', 'srq_results.screening_id', '=', 'screenings.id')
            ->selectRaw('
                CASE
                    WHEN srq_results.gme_indication = 1
                      OR srq_results.substance_use_indication = 1
                      OR srq_results.psychotic_symptom_indication = 1
                      OR srq_results.ptsd_symptom_indication = 1
                    THEN "Terindikasi"
                    ELSE "Tidak Terindikasi"
                END as category,
                COUNT(*) as total
            ')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        $result = [
            'Normal' => $sdqCounts['Normal'] ?? 0,
            'Borderline' => $sdqCounts['Borderline'] ?? 0,
            'Abnormal' => $sdqCounts['Abnormal'] ?? 0,
            'Terindikasi' => $srqCounts['Terindikasi'] ?? 0,
            'Tidak Terindikasi' => $srqCounts['Tidak Terindikasi'] ?? 0,
        ];

        return [
            'labels' => array_keys($result),
            'series' => [
                [
                    'name' => 'Jumlah Siswa',
                    'data' => array_values($result),
                ],
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

        if (! $item) {
            return null;
        }

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
