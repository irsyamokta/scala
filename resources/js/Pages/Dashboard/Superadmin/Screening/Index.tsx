import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { useSearch } from "@/hooks/useSearch";

import { ScreeningResult, ScreeningPageProps } from "@/types/screening";

import DashboardLayout from "@/Layouts/DashboardLayout";
import ScreeningTable from "./Components/table/ScreeningTable";
import ScreeningDetailModal from "./Components/modal/ScreeningModal";

export default function Index() {
    const { screenings, filters: localFilter } = usePage<ScreeningPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);

    const { filters, setFilter } = useSearch<{
        search: string;
        per_page: number;
    }>({
        routeName: "screening.index",
        initialFilters: {
            search: localFilter?.search ?? "",
            per_page: localFilter?.per_page ?? 10,
        },
    });

    return (
        <DashboardLayout title="Tes Skrining">
            <Head title="Tes Skrining" />

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
                    <ScreeningTable
                        screenings={screenings}
                        onView={(screening) => {
                            setIsModalOpen(true);
                            setSelectedScreening(screening);
                        }}
                        filters={filters}
                        setFilter={setFilter as any}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
