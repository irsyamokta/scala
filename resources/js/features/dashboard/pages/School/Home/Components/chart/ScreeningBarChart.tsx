import { router } from "@inertiajs/react";
import Chart from "react-apexcharts";

import ChartCard from "@/shared/components/card/ChartCard";
import Select from "@/shared/components/forms/Select";

interface Props {
    chart: {
        labels: string[];
        series: {
            name: string;
            data: number[];
        }[];
    };
    monthOptions: {
        value: string;
        label: string;
    }[];
    classOptions: {
        value: string;
        label: string;
    }[];
    selectedMonth: string;
    selectedClass: string;
}

export default function ScreeningBarChart({
    chart,
    monthOptions,
    classOptions,
    selectedMonth,
    selectedClass,
}: Props) {

    const handleChange = (type: "month" | "class", value: string) => {
        router.get(
            route("dashboard"),
            {
                month: type === "month" ? value : selectedMonth,
                class: type === "class" ? value : selectedClass,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "40%",
                distributed: true,
            },
        },
        xaxis: {
            categories: chart.labels,
        },
        colors: [
            "#2E986A",
            "#F4C319",
            "#B10F0F",
            "#FF3D3D",
            "#1ED348",
        ],
        grid: {
            strokeDashArray: 4,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} Siswa`,
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => Math.round(val).toString(),
            },
        },
    };

    return (
        <ChartCard
            title="Hasil Skrining"
            isMobile
            action={
                <div className="flex gap-2">
                    <div className="w-full md:w-36">
                        <Select
                            placeholder="Kelas"
                            value={selectedClass}
                            onChange={(value) =>
                                handleChange("class", value as string)
                            }
                            options={classOptions}
                        />
                    </div>

                    <div className="w-full md:w-32">
                        <Select
                            placeholder="Bulan"
                            value={selectedMonth}
                            onChange={(value) =>
                                handleChange("month", value as string)
                            }
                            options={monthOptions}
                        />
                    </div>
                </div>
            }
        >
            <Chart
                options={options}
                series={chart.series}
                type="bar"
                height={320}
            />
        </ChartCard>
    );
}
