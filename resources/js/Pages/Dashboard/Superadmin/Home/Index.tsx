import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/Components/card/DashboardWelcomeCard";
import StatCard from "@/Components/card/StatCard";
import ScreeningBarChart from "./Components/chart/ScreeningBarChart";
import CategoryDonutChart from "./Components/chart/CategoryDonutChart";

import { PiUsersThreeFill, PiBuildingApartmentFill } from "react-icons/pi";
import { RiTimerFlashFill } from "react-icons/ri";

export default function Index() {
    const { auth, data } = usePage().props as any;

    return (
        <DashboardLayout title="Beranda">
            <Head title="Superadmin" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title={`Selamat datang ${auth.user.name} di Dashboard Scala!`}
                        description="Pantau tes skrining, kelola pengguna, dan atur instrumen penilaian disini."
                    />

                    {/* Stat Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <StatCard
                            title="Menunggu Evaluasi"
                            value={data.pending}
                            icon={<PiUsersThreeFill size={32} />}
                        />

                        <StatCard
                            title="Tes Masuk Hari Ini"
                            value={data.today}
                            icon={<PiBuildingApartmentFill size={32} />}
                        />

                        <StatCard
                            title="Tes Dievaluasi"
                            value={data.done}
                            icon={<RiTimerFlashFill size={32} />}
                        />
                    </div>

                    {/* Chart Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <ScreeningBarChart
                            data={data.weekly}
                            weekOptions={data.week_options}
                            monthOptions={data.month_options}
                        />
                        <CategoryDonutChart
                            data={data.categories}
                            weekOptions={data.week_options}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
