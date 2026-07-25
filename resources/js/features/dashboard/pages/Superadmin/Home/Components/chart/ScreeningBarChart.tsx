import { useState } from "react";
import { router } from "@inertiajs/react";
import Chart from "react-apexcharts";

import ChartCard from "@/shared/components/card/ChartCard";
import Select from "@/shared/components/forms/Select";

interface Props {
    data: number[];
    weekOptions: {
        value: string;
        label: string;
    }[];
    monthOptions: {
        value: string;
        label: string;
    }[];
}

export default function ScreeningBarChart({
    data,
    weekOptions,
    monthOptions
}: Props) {
    const [month, setMonth] = useState("");

    const series = [
        {
            name: "Tes",
            data: data,
        },
    ];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            animations: {
                enabled: true,
                speed: 700,
                animateGradually: {
                    enabled: true,
                    delay: 100,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 400,
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "40%",
            },
        },
        yaxis: {
            title : {
                text: "Jumlah"
            },
            min: 0,
            forceNiceScale: true,
            decimalsInFloat: 0,
            labels: {
                formatter: (val: number) => Math.round(val).toString(),
            },
        },
        xaxis: {
            categories: weekOptions.map(w => w.label),
        },
        colors: ["#0C968D"],
        grid: {
            strokeDashArray: 4,
        },
    };

    const handleChange = (value: string) => {
        setMonth(value);

        router.get(route("dashboard"), { month: value }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <ChartCard
            title="Jumlah Tes Skrining"
            action={
                <div className="w-35 sm:w-40">
                    <Select
                        placeholder="Pilih Bulan"
                        value={month}
                        onChange={(value) => handleChange(value as string)}
                        options={monthOptions}
                    />
                </div>
            }
        >
            <Chart options={options} series={series} type="bar" height={300} />
        </ChartCard>
    );
}
