import { Link } from "@inertiajs/react";

import Badge from "@/shared/components/ui/badge/Badge";
import Button from "@/shared/components/ui/button/Button";

import ImageHero from "../../../../../assets/img/img-hero.webp";
import Decoration from "@assets/svg/bg-decoration.svg";

export default function HeroSection() {
    return (
        <section id="tentang" className="relative overflow-hidden px-6 lg:px-20 py-12 mb-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 xsm:gap-4 md:gap-12">
                {/* Left Content */}
                <div
                    className="max-w-2xl h-130 xsm:h-120 lg:h-150 flex flex-col md:justify-between gap-4">
                    <div
                        data-aos="fade-up"
                    >
                        <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                            <div
                                className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                Supervisi Psikolog
                            </div>
                        </Badge>

                        <h1 className="header-1 mb-6">
                            Skrining Kesehatan <br />
                            Mental Berbasis <br />
                            Instrumen Klinis
                        </h1>
                    </div>

                    <div
                        data-aos="fade-left"
                    >
                        <p className="paragraph-1 mb-8">
                            SCALA, Screening Kesehatan Mental Lintas Usia. Platform ini
                            dikembangkan untuk mendukung deteksi awal dan monitoring kondisi
                            emosional menggunakan instrumen terstandarisasi yang dikelola oleh
                            tim psikolog profesional.
                        </p>

                        <Link href="/uji-coba">
                            <Button size="lg" className="text-sm md:text-base">
                                Coba Tes Skrining
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Content */}
                <div
                    data-aos="fade-right"
                    className="relative">
                    <img
                        src={ImageHero}
                        alt="Scala Hero"
                        className="md:w-435 lg:w-335 2xl:w-135 h-auto object-cover"
                    />
                </div>
            </div>

            {/* Decoration */}
            <div className="absolute left-0 top-56 xsm:top-32 -z-10">
                <img
                    src={Decoration}
                    alt="Scala Decoration"
                    className="w-full lg:w-280 h-full object-cover hidden md:block"
                />
            </div>
        </section>
    );
}
