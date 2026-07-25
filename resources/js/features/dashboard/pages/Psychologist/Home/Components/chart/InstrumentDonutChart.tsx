import Chart from "react-apexcharts";
import ChartCard from "@/shared/components/card/ChartCard";

interface Props {
    data: {
        SDQ: number;
        SRQ: number;
    };
}

export default function InstrumentDonutChart({
    data
}: Props) {

    const series = [
        data.SDQ ?? 0,
        data.SRQ ?? 0,
    ];

    const total = series.reduce((a, b) => a + b, 0);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut",
        },
        stroke: {
            width: 6,
            colors: ["#E9ECEF"],
            lineCap: "round",
        },
        labels: ["SDQ", "SRQ"],
        colors: ["#2E986A", "#0D7DC1"],
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
                            label: "Total Tes",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6B7280",
                            formatter: () => String(total),
                        },
                    },
                },
            },
        },
    };

    return (
        <ChartCard
            title="Instrumen Tes"
        >
            <Chart options={options} series={series} type="donut" height={300} />
        </ChartCard>
    );
}
