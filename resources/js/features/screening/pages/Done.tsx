import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { LuCircleCheck, LuClipboardList, LuClock } from "react-icons/lu";

import AppLayout from "@/Layouts/AppLayout";

export default function GuestDone() {
    useEffect(() => {
        window.history.replaceState(null, "", "/skrining-selesai");

        const handlePopState = () => {
            window.location.href = "/";
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="Tes Selesai" />

            <div className="flex items-center justify-center px-4 py-16 min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-md text-center">

                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                        <LuCircleCheck size={44} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Tes Berhasil Dikerjakan!
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Terima kasih sudah mengikuti tes skrining.
                    </p>

                    <div className="mt-8 space-y-3 text-left">
                        <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <LuClipboardList size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Jawaban Tersimpan</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    Semua jawaban kamu telah berhasil tersimpan di sistem.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                <LuClock size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Menunggu Analisis</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    Hasil akan dianalisis oleh psikolog dan disampaikan oleh Guru BK.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-xs text-gray-400">
                        Halaman ini dapat ditutup sekarang.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
