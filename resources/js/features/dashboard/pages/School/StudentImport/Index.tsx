import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import StudentImportModal from "./Components/modal/StudentImportModal";
import StudentImportCard from "./Components/card/StudentImportCard";
import { StudentImportPageProps } from "@/types/student-import";

export default function Index() {
    const { classes } = usePage<StudentImportPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout title="Import Siswa">
            <Head title="Import Siswa" />

            <StudentImportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <StudentImportCard
                        classes={classes}
                        onImport={() => setIsModalOpen(true)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
