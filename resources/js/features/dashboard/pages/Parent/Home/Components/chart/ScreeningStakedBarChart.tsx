import { router } from "@inertiajs/react";
import Chart from "react-apexcharts";
import ChartCard from "@/shared/components/card/ChartCard";
import Select from "@/shared/components/forms/Select";

interface Props {
    subjects: {
        value: string;
        label: string;
    }[];
    selectedSubject: string;
    chart: {
        labels: string[];
        series: Record<string, number[]>;
    };
}

export default function ScreeningStackedBarChart({
    subjects,
    selectedSubject,
    chart,
}: Props) {

    const handleChange = (value: string) => {
        router.get(route("dashboard"), { subject_id: value }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const series = Object.keys(chart.series).map((key) => ({
        name: key,
        data: chart.series[key],
    }));

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    total: {
                        enabled: true,
                        offsetX: 0,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            categories: chart.labels,
        },
        yaxis: {
            title: {
                text: "Jumlah",
            },
            min: 0,
            forceNiceScale: true,
            decimalsInFloat: 0,
            labels: {
                formatter: (val: number) => Math.round(val).toString(),
            },
        },
        stroke: {
            width: 6,
            colors: ['']
        },
        legend: {
            position: "top",
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} data`,
            },
        },
        colors: [
            "#2E986A",
            "#F4C319",
            "#B10F0F",
            "#FF3D3D",
            "#1ED348",
        ],
    };

    return (
        <ChartCard
            title="Hasil Skrining"
            action={
                <div className="w-40 sm:w-60">
                    <Select
                        placeholder="Pilih Subject"
                        value={selectedSubject}
                        onChange={(value) => handleChange(value as string)}
                        options={subjects}
                    />
                </div>
            }
        >
            <Chart
                options={options}
                series={series}
                type="bar"
                height={320}
            />
        </ChartCard>
    );
}
