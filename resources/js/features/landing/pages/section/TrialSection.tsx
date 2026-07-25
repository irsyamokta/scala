import { Link } from "@inertiajs/react";
import Badge from "@/shared/components/ui/badge/Badge";
import Button from "@/shared/components/ui/button/Button";

import { PiCheckSquareOffset, PiInfoFill } from "react-icons/pi";
import { HiMiniDocumentText } from "react-icons/hi2";

import Decoration4 from "@assets/svg/bg-decoration-4.svg";

export default function TrialSection() {
    return (
        <section
            id="trial"
            data-aos="fade-up"
            className="relative px-6 lg:px-20 py-12 mb-10">
            <div className="relative overflow-hidden bg-secondary grid lg:grid-cols-2 items-start p-6 sm:p-10 gap-4 rounded-3xl z-10">
                {/* Title */}
                <div
                    data-aos="fade-up"
                    className="flex flex-col items-start">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Uji Coba Skrining
                        </div>
                    </Badge>

                    <div className="flex flex-col gap-4 max-w-lg">
                        <h1 className="header-2">
                            Lihat Gambaran <br />
                            Awal Secara Cepat
                        </h1>
                        <p className="subheader-2">
                            Tes ini merupakan versi singkat dari instrumen yang digunakan dalam sistem. Hasil yang ditampilkan bersifat indikasi awal dan tidak menggantikan evaluasi profesional.
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div
                    data-aos="fade-up"
                    className="bg-netral-100 rounded-2xl p-6 flex flex-col gap-5 border border-netral-300 w-full justify-self-end shadow-sm">
                    {/* Icon */}
                    <div className="flex items-center gap-3">
                        <HiMiniDocumentText size={28} className="text-primary" />
                        <h1 className="header-5">Preview Tes SRQ-29</h1>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5">
                        <p className="paragraph-1 text-netral-900">
                            Versi ringkas dari Self-Reporting Questionnaire untuk Anda dalam membantu mengidentifikasi indikasi awal kondisi mental emosional secara terstruktur.
                        </p>

                        <div className="flex items-center bg-secondary px-4 py-3 text-primary rounded-xl gap-3 w-fit mb-8">
                            <PiCheckSquareOffset size={20} />
                            <p className="subheader-2 font-semibold">
                                Tes untuk individu dewasa (≥18 tahun)
                            </p>
                        </div>

                        <Link href="/uji-coba">
                            <Button size="lg" className="w-full sm:w-auto">
                                Masuk Tes
                            </Button>
                        </Link>

                        <div className="flex items-center gap-2 text-netral-700">
                            <PiInfoFill size={20} className="text-primary shrink-0" />
                            <p className="paragraph-1">
                                Hasil bersifat indikatif dan tidak menggantikan evaluasi profesional.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decoration */}
                <img
                    src={Decoration4}
                    alt="Scala Decoration"
                    className="pointer-events-none absolute top-28 w-180 -left-2 hidden lg:block -z-1"
                />
            </div>
        </section>
    );
}
