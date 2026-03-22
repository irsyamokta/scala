import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { useSearch } from "@/hooks/useSearch";

import { Class, ClassPageProps } from "@/types/subject";

import DashboardLayout from "@/Layouts/DashboardLayout";
import ClassModal from "./Components/modal/ClassModal";
import ClassCard from "./Components/card/ClassCard";

export default function Index() {
    const { classes } = usePage<ClassPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const handleCreate = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Daftar Kelas">
            <Head title="Daftar Kelas" />

            <ClassModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedClass(null);
                }}
                classes={selectedClass}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <ClassCard
                        classes={classes}
                        onCreate={handleCreate}
                        onEdit={(subject) => {
                            setSelectedClass(subject);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
