import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

import { InstrumentPageProps, Instrument } from "@/types/instrument";

import DashboardLayout from "@/Layouts/DashboardLayout";
import AlertBanner from "@/Components/ui/alert/Alert";
import InstrumentFormBuilder from "../Partials/InstrumentFormBuilder";

export default function Index() {
    const { instruments } = usePage<InstrumentPageProps>().props;
    const defaultInstrument: Instrument = {
        id: "",
        name: "SDQ",
        instrument_types: []
    };

    const sdq: Instrument = instruments.find((i) => i.name === "SDQ") ?? defaultInstrument;

    return (
        <DashboardLayout title="Instrumen Tes">
            <Head title="SDQ" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">

                        {/* Header */}
                        <div className="flex flex-col w-full gap-6">
                            {/* Title */}
                            <div>
                                <h2 className="text-lg font-semibold text-netral-900">
                                    Strengths and Difficulties Questionnaire Test
                                </h2>

                                <p className="text-sm text-netral-600 mt-1">
                                    Pertanyaan ini akan digunakan untuk diisi oleh pengguna.
                                </p>
                            </div>

                            {/* Alert Banner */}
                            <AlertBanner
                                size="sm"
                                title="Informasi: "
                                children="Gunakan reverse score untuk membalik urutan skor jawaban sehingga nilai tertinggi menjadi terendah dan sebaliknya. (Default 0, 1, 2)"
                                variant="warning"
                            />

                            {/* Form */}
                            <InstrumentFormBuilder
                                instrument={sdq}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
