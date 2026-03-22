import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/Components/card/DashboardWelcomeCard";
import StatCard from "@/Components/card/StatCard";
import ScreeningBarChart from "./Components/chart/ScreeningBarChart";

import { PiUsersThreeFill, PiChalkboardTeacherFill } from "react-icons/pi";

export default function Index() {
    const { auth, data } = usePage().props as any;

    return (
        <DashboardLayout title="Beranda">
            <Head title="Sekolah" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title={`Selamat datang ${auth.user.name} di Dashboard Scala!`}
                        description="Pantau kondisi emosional dan perilaku para siswa dengan mudah."
                    />

                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        {/* Stat Cards */}
                        <div className="col-span-12 lg:col-span-4 grid gap-4 md:gap-6">
                            <StatCard
                                title="Jumlah Total Siswa"
                                value={data.students}
                                icon={<PiUsersThreeFill size={32} />}
                            />

                            <StatCard
                                title="Jumlah Kelas"
                                value={data.classes}
                                icon={<PiChalkboardTeacherFill size={32} />}
                            />
                        </div>

                        {/* Chart */}
                        <div className="col-span-12 lg:col-span-8">
                            <ScreeningBarChart
                                chart={data.chart}
                                selectedMonth={data.selected_month}
                                selectedClass={data.selected_class ?? "all"}
                                monthOptions={data.month_options}
                                classOptions={data.class_options}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
