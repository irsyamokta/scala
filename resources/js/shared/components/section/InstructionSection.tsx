import React from "react";
import InstructionCard from "@/shared/components/card/InstructionCard";

const steps = [
    {
        step: "01",
        title: "Pilih dan Isi kuisioner SDQ atau SRQ",
        description:
            "Pilih tes dibawah ini & jawab pertanyaan singkat seputar perilaku dan emosi.",
    },
    {
        step: "02",
        title: "Lihat Hasil Skrining",
        description:
            "Hasil langsung dianalisis untuk memberikan gambaran kondisi mental.",
    },
    {
        step: "03",
        title: "Dapatkan Insight & Rekomendasi",
        description:
            "Dapatkan rekomendasi dan langkah selanjutnya dari psikolog profesional.",
    },
];

const InstructionSection: React.FC = () => {
    return (
        <section className="rounded-xl bg-netral-100 border border-netral-300 p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-netral-900">
                    Tata Cara Pengerjaan Tes Skrining
                </h2>
                <p className="text-sm text-netral-600">
                    Berikut adalah daftar anak yang dapat Anda lakukan tes skrining
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {steps.map((item) => (
                    <InstructionCard
                        key={item.step}
                        step={item.step}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default InstructionSection;