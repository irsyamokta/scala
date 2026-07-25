import { router } from "@inertiajs/react";
import { useState } from "react";

import Chart from "react-apexcharts";
import ChartCard from "@/shared/components/card/ChartCard";
import Select from "@/shared/components/forms/Select";

interface Props {
    data: {
        Normal: number;
        Borderline: number;
        Abnormal: number;
        Terindikasi: number;
        "Tidak Terindikasi": number;
    };
    weekOptions: {
        value: string;
        label: string;
    }[];
}

export default function CategoryDonutChart({
    data,
    weekOptions
}: Props) {
    const [week, setWeek] = useState<string | undefined>();

    const series = [
        data.Normal,
        data.Borderline,
        data.Abnormal,
        data["Terindikasi"],
        data["Tidak Terindikasi"],
    ];

    const total = series.reduce((acc, val) => acc + val, 0);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut",
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 100,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 500,
                },
            },
        },
        stroke: {
            width: 6,
            colors: ["#E9ECEF"],
            lineCap: "round",
        },
        labels: [
            "Normal",
            "Borderline",
            "Abnormal",
            "Terindikasi",
            "Tidak Terindikasi",
        ],
        colors: [
            "#2E986A",
            "#F4C319",
            "#B10F0F",
            "#FF3D3D",
            "#1ED348",
        ],
        legend: {
            show: true,
            position: "bottom"
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: {
                        show: true,

                        name: {
                            show: true,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6B7280",
                        },

                        value: {
                            show: true,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#111827",
                        },

                        total: {
                            show: true,
                            label: "Jumlah Tes Skrining",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6B7280",
                            formatter: () => `${total}`,
                        },
                    },
                },
            },
        },
    };

    const handleChangeWeek = (value: string) => {
        setWeek(value);

        router.get(
            route("dashboard"),
            { week: value },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <ChartCard
            title="Distribusi Kategori"
            action={
                <div className="w-35 sm:w-40">
                    <Select
                        placeholder="Pilih Minggu"
                        value={week || ""}
                        onChange={(value) => handleChangeWeek(value as string)}
                        options={weekOptions}
                    />
                </div>
            }
        >
            <Chart
                key={series.join("-")}
                options={options}
                series={series}
                type="donut"
                height={300}
            />
        </ChartCard>
    );
}
