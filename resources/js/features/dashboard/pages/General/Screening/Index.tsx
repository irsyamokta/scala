import { useEffect } from "react";
import { Head } from '@inertiajs/react';
import { usePage, router } from "@inertiajs/react";
import { toast } from 'sonner';

import { SubjectPageProps } from "@/types/subject";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DashboardWelcomeCard from "@/shared/components/card/DashboardWelcomeCard";
import ScreeningCard from "@/shared/components/card/ScreeningCard";
import InstructionSection from "@/shared/components/section/InstructionSection";

export default function Index() {

    const { subjects } = usePage<SubjectPageProps>().props;
    const { flash } = usePage().props as any;

    const subject = subjects?.[0];

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const startScreening = (instrument: "SDQ" | "SRQ") => {

        router.get(
            route("screening.form", {
                instrument,
                subject: subject.id
            })
        );
    };

    return (
        <DashboardLayout title="Tes Skrining">
            <Head title="Tes Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-4 md:space-y-6">

                    {/* Welcome Card */}
                    <DashboardWelcomeCard
                        title="Yuk, lakukan tes skrining dini secara berkala!"
                        description="Gunakan tes skrining untuk memahami kondisi emosional dan perilaku anak."
                    />

                    {/* Instruction Section */}
                    <InstructionSection />

                    {/* Screening Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        <ScreeningCard
                            title="Tes Skrining"
                            highlight="SDQ"
                            description="Tes berisi 25 soal untuk dijawab"
                            info="Tes untuk remaja (11-17 tahun)"
                            onClick={() => startScreening("SDQ")}
                        />

                        <ScreeningCard
                            title="Tes Skrining"
                            highlight="SRQ"
                            description="Tes berisi 29 soal untuk dijawab"
                            info="Tes untuk individu dewasa (≥18 tahun)"
                            onClick={() => startScreening("SRQ")}
                        />

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}