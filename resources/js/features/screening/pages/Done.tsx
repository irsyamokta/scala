import { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { LuCircleCheck, LuHouse } from "react-icons/lu";

export default function GuestDone() {
    useEffect(() => {
        window.history.replaceState(null, "", "/");
        window.history.pushState(null, "", route("guest.screening.done"));

        const handlePopState = () => {
            window.location.href = "/";
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    return (
        <>
            <Head title="Tes Selesai" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md text-center">

                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                        <LuCircleCheck size={44} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Tes Selesai!
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Terima kasih sudah mengikuti tes skrining.
                        Hasil akan dianalisis oleh psikolog dan disampaikan
                        melalui Guru BK kamu.
                    </p>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
                        <p>Kamu boleh menutup halaman ini sekarang.</p>
                    </div>

                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                        <LuHouse size={16} />
                        Kembali ke Beranda
                    </Link>

                </div>
            </div>
        </>
    );
}
