import { useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { toast } from "sonner";

import { LuDot } from "react-icons/lu";

import Logo from "@assets/svg/logo-color.svg";
import Illustration from "@assets/svg/img-onboarding-2.svg";

export default function Processing() {

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.post(route("onboarding.complete"), {}, {
                onSuccess: () => {
                    toast.success("Akun berhasil disiapkan");
                },
                onError: () => {
                    toast.error("Gagal menyiapkan akun");
                }
            });
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center h-screen text-center px-6 gap-6">
            <Head title="Menyiapkan Akun Anda" />

            {/* Logo */}
            <img
                src={Logo}
                alt="Scala logo"
                className="mx-auto mb-10"
            />

            {/* Illustrstion */}
            <img src={Illustration} className="mx-auto w-56 lg:w-64 mb-8" />

            {/* Content */}
            <div>
                <h2 className="header-4 flex items-end justify-center gap-1">
                    Menyiapkan Akun Anda
                    <span className="flex">
                        <LuDot size={24} className="animate-bounce -mr-2" />
                        <LuDot size={24} className="animate-bounce [animation-delay:0.2s] -mr-2" />
                        <LuDot size={24} className="animate-bounce [animation-delay:0.4s]" />
                    </span>
                </h2>
                <p className="text-sm text-netral-600 md:paragraph-1 mt-6">
                    Kami sedang menyesuaikan pengalaman penggunaan agar sesuai dengan peran dan kebutuhan Anda.
                </p>
            </div>
        </div>
    );
}
