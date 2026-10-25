import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    LuKeyRound,
    LuClipboardList,
    LuCircleCheck,
    LuClock,
    LuChevronRight,
    LuInfo,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import InputField from "@/shared/components/forms/InputField";
import { StudentDashboardPageProps, StudentPin } from "@/types/pin-batch";

export default function StudentDashboard() {
    const { active_pins, screening_history } =
        usePage<StudentDashboardPageProps>().props;

    const [pinInput, setPinInput] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handlePinSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!pinInput.trim()) return;

        setSubmitting(true);
        router.post(
            route("screening.pin.validate"),
            { pin_code: pinInput.toUpperCase().trim() },
            { onFinish: () => setSubmitting(false) }
        );
    }

    return (
        <DashboardLayout title="Dashboard Siswa">
            <Head title="Dashboard Siswa" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* PIN Entry Card */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <LuKeyRound size={18} />
                            </span>
                            <div>
                                <h2 className="font-semibold text-gray-800 dark:text-white">
                                    Mulai Tes
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Masukkan PIN dari Guru BK
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handlePinSubmit} className="space-y-4">
                            <div>
                                <InputField
                                    placeholder="Contoh: AB12CD34"
                                    maxLength={8}
                                    value={pinInput}
                                    onChange={(e) =>
                                        setPinInput(
                                            e.target.value
                                                .toUpperCase()
                                                .replace(/[^A-Z0-9]/g, "")
                                        )
                                    }
                                    className="text-center font-mono text-xl font-bold tracking-widest"
                                    hint="PIN 8 karakter huruf dan angka"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={pinInput.length !== 8 || submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Memvalidasi..." : "Mulai Tes"}
                            </button>
                        </form>

                        {/* PIN aktif */}
                        {active_pins.length > 0 && (
                            <div className="mt-5">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    PIN Tersedia
                                </p>
                                <div className="space-y-2">
                                    {active_pins.map((pin) => (
                                        <ActivePinItem
                                            key={pin.id}
                                            pin={pin}
                                            onUse={() => {
                                                setPinInput(pin.pin_code);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {active_pins.length === 0 && (
                            <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                <LuInfo size={14} className="mt-0.5 shrink-0" />
                                Belum ada PIN aktif. Minta PIN dari Guru BK untuk memulai tes.
                            </div>
                        )}
                    </div>
                </div>

                {/* Riwayat Tes */}
                <div className="col-span-12 lg:col-span-7">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                            <LuClipboardList size={18} className="text-gray-500" />
                            <h2 className="font-semibold text-gray-800 dark:text-white">
                                Riwayat Tes
                            </h2>
                        </div>

                        {screening_history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <LuClipboardList size={36} className="mb-3 opacity-30" />
                                <p className="text-sm">Belum ada riwayat tes.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {screening_history.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={route("student.screening.result", s.id)}
                                            className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold ${
                                                    s.instrument?.name === "SDQ"
                                                        ? "bg-emerald-500"
                                                        : "bg-violet-500"
                                                }`}
                                            >
                                                {s.instrument?.name ?? "—"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-800 dark:text-white">
                                                    {s.student_pin?.batch?.label ??
                                                        "Tes Skrining"}
                                                </p>
                                                <p className="flex items-center gap-1 text-xs text-gray-400">
                                                    <LuClock size={11} />
                                                    {new Date(s.date_taken).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={s.status} result={s.sdq_result?.overall_category} />
                                                <LuChevronRight size={16} className="text-gray-400" />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function ActivePinItem({
    pin,
    onUse,
}: {
    pin: StudentPin;
    onUse: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2">
            <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-primary tracking-widest">
                    {pin.pin_code}
                </p>
                <p className="truncate text-xs text-gray-500">
                    {pin.batch?.label ?? "Tes Skrining"}
                    {pin.batch?.instrument && (
                        <span className="ml-1 font-medium">
                            · {pin.batch.instrument.name}
                        </span>
                    )}
                </p>
            </div>
            <button
                onClick={onUse}
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary/90"
            >
                Pakai
            </button>
        </div>
    );
}

function StatusBadge({
    status,
    result,
}: {
    status: string;
    result?: string;
}) {
    if (status === "Selesai" && result) {
        const colors: Record<string, string> = {
            Normal: "bg-green-100 text-green-700",
            Borderline: "bg-yellow-100 text-yellow-700",
            Abnormal: "bg-red-100 text-red-700",
        };
        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    colors[result] ?? "bg-gray-100 text-gray-700"
                }`}
            >
                <LuCircleCheck size={11} />
                {result}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            <LuClock size={11} />
            {status}
        </span>
    );
}
