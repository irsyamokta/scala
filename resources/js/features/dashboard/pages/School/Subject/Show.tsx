import { useState } from "react";
import { PageProps } from "@inertiajs/core";
import { Head, usePage } from "@inertiajs/react";

import { Subject } from "@/types/subject";
import { ScreeningResult } from "@/types/screening";

import DashboardLayout from "@/Layouts/DashboardLayout";
import TestHistoryCard from "./Components/card/TestHistoryCard";
import ScreeningDetailModal from "./Components/modal/ScreeningModal";

type ShowPageProps = PageProps & {
    subject: Subject;
    screenings: ScreeningResult[];
};

export default function Show() {

    const { subject, screenings } = usePage<ShowPageProps>().props;

    const screeningsPagination = {
        data: screenings,
        current_page: 1,
        last_page: 1,
        per_page: screenings.length,
        total: screenings.length,
        links: [],
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScreening, setSelectedScreening] =
        useState<ScreeningResult | null>(null);

    const handleView = (screening: ScreeningResult) => {
        setSelectedScreening(screening);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Profil Siswa">
            <Head title="Riwayat Tes" />

            <ScreeningDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedScreening(null);
                }}
                screening={selectedScreening}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <TestHistoryCard
                        subject={subject}
                        screenings={screeningsPagination}
                        onView={handleView}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}