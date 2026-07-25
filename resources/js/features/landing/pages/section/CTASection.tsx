import { Link } from "@inertiajs/react";
import Button from "@/shared/components/ui/button/Button";

import Wallpaper from "../../../../../assets/img/bg-wallpaper.webp";

export default function CTASection() {
    return (
        <section
            id="cta"
            data-aos="fade-up"
            className="relative overflow-hidden px-6 lg:px-20 py-12 mb-10">
            <div className="relative overflow-hidden rounded-3xl z-10">
                {/* Background Image */}
                <img
                    src={Wallpaper}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content */}
                <div
                    data-aos="fade-up"
                    className="relative flex flex-col items-center p-6 sm:p-12 gap-4 text-white">
                    <div className="flex flex-col gap-4 mb-10">
                        <h1 className="header-2 text-center text-white">
                            Langkah Awal Evaluasi <br />
                            Dimulai dari Sini!
                        </h1>

                        <p className="subheader-2 text-center max-w-lg text-white/90">
                            Lakukan skrining berbasis instrumen klinis dan dapatkan hasil yang lebih terarah dengan sistem monitoring profesional.
                        </p>
                    </div>

                    <Link href="/login">
                        <Button size="lg" variant="secondary">
                            Mulai Sekarang
                        </Button>
                    </Link>

                </div>
            </div>
        </section>
    );
}
