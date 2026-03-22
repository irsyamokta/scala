import { Head } from "@inertiajs/react";

import { NextProps } from "@/types/onboarding";

import Button from "@/Components/ui/button/Button";

import ImageOnboarding from "../../../../assets/svg/img-onboarding-1.svg";
import Logo from "../../../../assets/svg/logo-color.svg";

export default function WelcomeStep({ onNext }: NextProps) {
    return (
        <div className="flex flex-col h-screen max-w-2xl">
            <Head title="Selamat Datang di Platform Scala!" />

            <div className="pt-6 pb-4 shrink-0">
                {/* Logo */}
                <img
                    src={Logo}
                    alt="Scala logo"
                    className="mx-auto mb-10"
                    data-aos="zoom-in"
                />

                {/* Illustrstion */}
                <img
                    src={ImageOnboarding}
                    className="mx-auto w-56 lg:w-64 mb-8"
                    data-aos="zoom-in"
                />
            </div>

            {/* Content */}
            <div className="flex-1 text-center overflow-y-auto px-6">
                <h2
                    className="header-4"
                    data-aos="fade-right"
                >
                    Selamat Datang di Platform Scala!
                </h2>

                <p
                    className="text-sm text-netral-600 md:paragraph-1 mt-4"
                    data-aos="fade-left"
                >
                    Sebelum memulai, kami akan menanyakan beberapa informasi singkat
                    untuk menyesuaikan pengalaman penggunaan platform ini dengan kebutuhan Anda.
                </p>

            </div>

            {/* Action Button */}
            <div className="px-6 py-4 bg-netral-100 flex items-center justify-center gap-4 shrink-0">
                <Button
                    size="lg"
                    onClick={onNext}
                    className="w-full md:w-76 mt-10 lg:mt-20"
                >
                    Lanjutkan
                </Button>
            </div>
        </div>
    );
}
