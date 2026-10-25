import { Head } from "@inertiajs/react";
import { LuLock } from "react-icons/lu";

import AppLayout from "@/Layouts/AppLayout";

export default function GuestScreeningInvalid() {
    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="Tes Tidak Tersedia" />

            <div className="flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-sm text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-6">
                        <LuLock size={32} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Sesi Tes Tidak Tersedia
                    </h1>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        Link tes ini sudah tidak aktif, kedaluwarsa, atau tidak valid.
                        Hubungi Guru BK Anda untuk informasi lebih lanjut.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
