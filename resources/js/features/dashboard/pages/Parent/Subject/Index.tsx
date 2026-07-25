import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { useSearch } from "@/shared/hooks/useSearch";

import { Subject, SubjectPageProps } from "@/types/subject";

import DashboardLayout from "@/Layouts/DashboardLayout";
import SubjectParentModal from "./Components/modal/SubjectParentModal";
import SubjectParentCard from "./Components/card/SubjectParentCard";

export default function Index() {
    const { subjects, filters } = usePage<SubjectPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const { filters: localFilters, setFilter } = useSearch<{
        search: string
        gender: string[]
    }>({
        routeName: "subject.parent.index",
        initialFilters: {
            search: filters?.search ?? "",
            gender: filters?.gender ?? [],
        },
    });

    const handleCreate = () => {
        setSelectedSubject(null);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Profil Keluarga">
            <Head title="Profil Keluarga" />

            <SubjectParentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSubject(null);
                }}
                subject={selectedSubject}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <SubjectParentCard
                        subjects={subjects}
                        filters={localFilters}
                        setFilter={setFilter}
                        onCreate={handleCreate}
                        onEdit={(subject) => {
                            setSelectedSubject(subject);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
