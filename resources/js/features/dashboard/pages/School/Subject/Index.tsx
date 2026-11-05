import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { useSearch } from "@/shared/hooks/useSearch";

import { Subject, SchoolSubjectPageProps } from "@/types/subject";

import DashboardLayout from "@/Layouts/DashboardLayout";
import SubjectStudentModal from "./Components/modal/SubjectStudentModal";
import SubjectStudentCard from "./Components/card/SubjectStudentCard";

export default function Index() {
    const { subjects, classes, filters: search } = usePage<SchoolSubjectPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const { filters, setFilter } = useSearch<{
        search: string;
        gender: string[];
        class_id: string[];
        per_page: number;
    }>({
        routeName: "subject.school.index",
        initialFilters: {
            search: search?.search ?? "",
            gender: search?.gender ?? [],
            class_id: search?.class_id ?? [],
            per_page: search?.per_page ?? 10,
        },
    });

    const handleCreate = () => {
        setSelectedSubject(null);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Profil Siswa">
            <Head title="Profil Siswa" />

            <SubjectStudentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSubject(null);
                }}
                subject={selectedSubject}
                classes={classes}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <SubjectStudentCard
                        subjects={subjects}
                        classes={classes}
                        filters={filters}
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
