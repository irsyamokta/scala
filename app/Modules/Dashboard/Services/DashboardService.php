<?php

namespace App\Modules\Dashboard\Services;

use App\Models\Clazz;
use App\Modules\Dashboard\Repositories\DashboardRepository;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        protected DashboardRepository $repo
    ) {}

    // SUPERADMIN
    public function superadmin($month, $week = null)
    {
        $weekly = $this->repo->weeklyScreeningByMonth($month);
        $weeks = [1 => 0, 2 => 0, 3 => 0, 4 => 0];

        foreach ($weekly as $item) {
            $weeks[$item->week] = $item->total;
        }

        return [
            // stat cards
            'pending' => $this->repo->countByStatus('Menunggu Evaluasi'),
            'done' => $this->repo->countByStatus('Selesai Dievaluasi'),
            'today' => $this->repo->countToday(),

            // weekly screening
            'weekly' => array_values($weeks),

            // result by category
            'categories' => $this->repo->categoryDistribution($week),

            // options
            'week_options' => $this->generateWeeks($month),
            'month_options' => $this->generateMonths(),
        ];
    }

    // PSYCHOLOGIST
    public function psychologist()
    {
        return [
            // stat cards
            'pending' => $this->repo->countByStatus('Menunggu Evaluasi'),
            'done' => $this->repo->countByStatus('Selesai Dievaluasi'),
            'today' => $this->repo->countToday(),

            // latest screening
            'latest' => $this->repo->latestScreeningsForPsychologist(),

            // sdq vs srq
            'instruments' => $this->repo->instrumentComparison(),
        ];
    }

    // PARENT
    public function parent($userId, $subjectId = null)
    {
        $subjects = $this->repo->parentSubjects($userId);

        $selected = $subjectId ?? optional($subjects->first())->id;

        $trendRaw = $selected
            ? $this->repo->subjectCategoryTrend($selected)
            : [];

        // transform ke format chart
        $labels = array_keys($trendRaw);

        $series = [
            'Normal' => [],
            'Borderline' => [],
            'Abnormal' => [],
            'Terindikasi' => [],
            'Tidak Terindikasi' => [],
        ];

        foreach ($trendRaw as $month => $values) {
            foreach ($series as $key => $val) {
                $series[$key][] = $values[$key] ?? 0;
            }
        }

        return [
            'subjects' => $subjects->map(fn($s) => [
                'value' => $s->id,
                'label' => $s->name,
            ]),

            'selected_subject' => $selected,

            'chart' => [
                'labels' => $labels,
                'series' => $series,
            ],

            'latest' => $this->repo->latestResults($userId),
        ];
    }

    // SCHOOL
    public function school($userId, $month, $class = null)
    {
        return [
            'students' => $this->repo->totalStudents($userId),
            'classes' => $this->repo->totalClasses($userId),

            'chart' => $this->repo->schoolChart($userId, $month, $class),

            'class_options' => collect([
                [
                    'value' => 'all',
                    'label' => 'Semua Kelas',
                ]
            ])->merge(
                Clazz::where('school_user_id', $userId)
                    ->orderBy('class_name')
                    ->pluck('class_name')
                    ->map(fn($c) => [
                        'value' => $c,
                        'label' => $c,
                    ])
            )->values(),

            'selected_class' => $class,

            'month_options' => $this->generateMonths(),
            'selected_month' => $month,
        ];
    }

    // GENERAL
    public function general($userId)
    {
        $subject = $this->repo->selfSubject($userId);

        if (!$subject) return [];

        $trendRaw = $this->repo->subjectCategoryTrend($subject->id);

        $labels = array_keys($trendRaw);

        $series = [
            'Normal' => [],
            'Borderline' => [],
            'Abnormal' => [],
            'Terindikasi' => [],
            'Tidak Terindikasi' => [],
        ];

        foreach ($trendRaw as $month => $values) {
            foreach ($series as $key => $val) {
                $series[$key][] = $values[$key] ?? 0;
            }
        }

        return [
            'total' => $this->repo->totalScreeningBySubject($subject->id),

            'last' => $this->repo->lastScreening($subject->id),

            'chart' => [
                'labels' => $labels,
                'series' => $series,
            ],
        ];
    }

    private function generateWeeks($month)
    {
        $startOfMonth = Carbon::parse($month)->startOfMonth();
        $endOfMonth = Carbon::parse($month)->endOfMonth();

        $weeks = [];
        $current = $startOfMonth->copy()->startOfWeek();

        $i = 1;

        while ($current <= $endOfMonth) {
            $weekStart = $current->copy();
            $weekEnd = $current->copy()->endOfWeek();

            $weeks[] = [
                'value' => $weekStart->toDateString() . '|' . $weekEnd->toDateString(),
                'label' => 'Minggu ' . $i,
            ];

            $current->addWeek();
            $i++;
        }

        return $weeks;
    }

    private function generateMonths($year = null)
    {
        $year = $year ?? now()->year;

        $months = [];

        for ($m = 1; $m <= 12; $m++) {
            $date = Carbon::create($year, $m, 1);

            $months[] = [
                'value' => $date->format('Y-m'),
                'label' => $date->translatedFormat('F'),
            ];
        }

        return $months;
    }
}
