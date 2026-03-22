import { useState } from "react";
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { SubjectPageProps } from "@/types/subject";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/Components/card/DashboardWelcomeCard";
import ScreeningCard from "@/Components/card/ScreeningCard";
import InstructionSection from "@/Components/section/InstructionSection";
import SelectSubjectModal from "./Components/modal/SelectSubjectModal";

export default function Index() {
    const { subjects } = usePage<SubjectPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instrument, setInstrument] = useState<"SDQ" | "SRQ" | null>(null);

    return (
        <DashboardLayout title="Tes Skrining">
            <Head title="Tes Skrining" />

            <SelectSubjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setInstrument(null);
                }}
                subjects={subjects}
                instrument={instrument || "SDQ"}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title="Yuk, lakukan tes skrining dini secara berkala!"
                        description="Gunakan tes skrining untuk memahami kondisi emosional dan perilaku anak."
                    />

                    {/* Instruction Section */}
                    <InstructionSection />

                    {/* Chart Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <ScreeningCard
                            title="Tes Skrining"
                            highlight="SDQ"
                            description="Tes berisi 25 soal untuk dijawab"
                            info="Tes untuk anak & remaja (4-17 tahun)"
                            onClick={() => {
                                setInstrument("SDQ");
                                setIsModalOpen(true);
                            }}
                        />

                        <ScreeningCard
                            title="Tes Skrining"
                            highlight="SRQ"
                            description="Tes berisi 29 soal untuk dijawab"
                            info="Tes untuk individu dewasa (≥18 tahun)"
                            onClick={() => {
                                setInstrument("SRQ");
                                setIsModalOpen(true);
                            }}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
