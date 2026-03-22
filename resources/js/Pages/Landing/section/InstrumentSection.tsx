import Badge from "@/Components/ui/badge/Badge";

import { PiCheckSquareOffset } from "react-icons/pi";

import Decoration1 from "../../../../assets/svg/bg-decoration-2.svg";
import Decoration2 from "../../../../assets/svg/bg-decoration-3.svg";

interface InstrumentItem {
    number: string;
    title: string;
    descriptions: string[];
}

const DATA: InstrumentItem[] = [
    {
        number: "01",
        title: "SDQ (Strengths and Difficulties Questionnaire)",
        descriptions: [
            "SDQ menilai aspek emosional, perilaku, konsentrasi, relasi sosial, dan perilaku prososial melalui pendekatan multi–informan (orang tua, guru, dan remaja).",
            "Digunakan untuk anak dan remaja usia 4–17 tahun.",
            "Sistem secara otomatis menghitung skor dan mengelompokkan hasil berdasarkan kategori risiko untuk membantu interpretasi awal."
        ]
    },
    {
        number: "02",
        title: "SRQ-29 (Self-Reporting Questionnaire)",
        descriptions: [
            "SRQ-29 membantu mengidentifikasi indikasi gangguan mental emosional melalui 29 pertanyaan reflektif dengan sistem skoring terstruktur.",
            "Digunakan untuk individu dewasa (≥18 tahun).",
            "Hasil diklasifikasikan berdasarkan cut-off risiko untuk mendukung tindak lanjut profesional bila diperlukan."
        ]
    }
];

export default function InstrumentSection() {
    return (
        <section id="sdq-srq" className="relative overflow-hidden bg-secondary px-6 lg:px-20 py-12 pt-24 mb-10">
            <div className="relative flex flex-col gap-12 z-10">
                {/* Title */}
                <div
                    data-aos="fade-up"
                    className="flex flex-col items-start">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Instrument yang Digunakan
                        </div>
                    </Badge>

                    <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                        <h1 className="header-2">
                            Instrumen Skrining <br />
                            yang Terstandarisasi
                        </h1>
                        <p className="max-w-lg subheader-2">
                            Platform ini menggunakan instrumen psikologis yang telah banyak digunakan dalam praktik dan layanan kesehatan mental untuk mendukung proses evaluasi awal secara lebih objektif dan terukur.
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-4">
                    {DATA.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            className="bg-netral-100 rounded-2xl p-5 flex flex-col gap-4 border border-netral-300 hover:shadow-lg"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 flex justify-center items-center font-semibold text-2xl text-primary p-4 bg-secondary rounded-xl mb-6">
                                {item.number}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-6">
                                <h5 className="header-5">
                                    {item.title}
                                </h5>
                                <div className="flex flex-col gap-4">
                                    {item.descriptions.map((desc, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <PiCheckSquareOffset
                                                size={22}
                                                className="text-primary mt-1 shrink-0"
                                            />
                                            <p className="subheader-2 lg:pr-16">
                                                {desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decoration */}
            <img
                src={Decoration1}
                alt="Scala Decoration"
                className="pointer-events-none absolute top-8 w-280 -left-20 hidden lg:block"
            />
            <img
                src={Decoration2}
                alt="Scala Decoration"
                className="pointer-events-none absolute -bottom-1 w-110 right-1"
            />
        </section>
    );
}
