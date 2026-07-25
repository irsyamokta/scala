import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/shared/components/card/DashboardWelcomeCard";
import StatCard from "@/shared/components/card/StatCard";
import ScreeningStackedBarChart from './Components/chart/ScreeningStakedBarChart';

import { PiUsersThreeFill } from "react-icons/pi";
import { RiTimerFlashFill } from "react-icons/ri"

export default function Index() {
    const { auth, data } = usePage().props as any;

    return (
        <DashboardLayout title="Beranda">
            <Head title="Umum" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title={`Selamat datang ${auth.user.name} di Dashboard Scala!`}
                        description="Pantau kondisi emosional dan perilaku Anda dengan mudah"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Stat Card */}
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            <StatCard
                                title="Total Tes Dilakukan"
                                value={data?.total}
                                icon={<PiUsersThreeFill size={32} />}
                            />

                            <StatCard
                                title="Hasil Terakhir"
                                value={data?.last?.category ?? "-"}
                                icon={<RiTimerFlashFill size={32} />}
                            />
                        </div>

                        {/* Chart Card */}
                        <ScreeningStackedBarChart
                            subjects={data?.subjects}
                            chart={data?.chart}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
