import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/shared/components/card/DashboardWelcomeCard";
import ScreeningStakedChart from "./Components/chart/ScreeningStakedBarChart";
import HistoryTestCard from "./Components/card/HistoryTestCard";

export default function Index() {
    const { auth, data } = usePage().props as any;

    return (
        <DashboardLayout title="Beranda">
            <Head title="Orang Tua" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title={`Selamat datang ${auth.user.name} di Dashboard Scala!`}
                        description="Pantau kondisi emosional dan perilaku anak Anda dengan mudah."
                    />

                    {/* Chart Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <ScreeningStakedChart
                            subjects={data.subjects}
                            selectedSubject={data.selected_subject}
                            chart={data.chart}
                        />
                        <HistoryTestCard
                            data={data.latest}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
