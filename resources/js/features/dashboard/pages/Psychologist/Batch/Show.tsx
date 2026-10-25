import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    LuArrowLeft,
    LuKeyRound,
    LuUsers,
    LuCircleCheck,
    LuClock,
    LuClipboardList,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { PinBatchShowPageProps, StudentPin } from "@/types/pin-batch";
import { ScreeningResult } from "@/types/screening";
import ScreeningDetailModal from "../Screening/Components/modal/ScreeningModal";

export default function PsychologistBatchShow() {
    const { batch, pins } = usePage<PinBatchShowPageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<ScreeningResult | null>(null);

    const usedCount  = pins.filter((p) => p.used_at).length;
    const doneCount  = pins.filter(
        (p) => p.screening?.status === "Selesai Dievaluasi"
    ).length;

    function handleView(pin: StudentPin) {
        if (!pin.screening) return;
        // Build a ScreeningResult shape dari data pin.screening
        // Psikolog butuh full screening data — kita fetch via route show
        // Untuk saat ini, buka halaman detail screening
        window.location.href = route("screening.batch.screening", {
            batch: batch.id,
            screening: pin.screening.id,
        });
    }

    return (
        <DashboardLayout title={batch.label}>
            <Head title={batch.label} />

            <ScreeningDetailModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelected(null); }}
                screening={selected}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* Breadcrumb */}
                <div className="col-span-12 flex items-center gap-3">
                    <a
                        href={route("pin-batch.index")}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-primary"
                    >
                        <LuArrowLeft size={15} />
                        Batch Skrining
                    </a>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {batch.label}
                    </span>
                </div>

                {/* Summary */}
                <div className="col-span-12 md:col-span-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 space-y-4">
                        <h2 className="font-bold text-gray-800 dark:text-white">{batch.label}</h2>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p className="flex items-center gap-2">
                                <LuUsers size={14} className="text-gray-400" />
                                Kelas: <strong>{batch.class?.class_name ?? "-"}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <LuKeyRound size={14} className="text-gray-400" />
                                Instrumen: <strong>{batch.instrument?.name ?? "-"}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <LuUsers size={14} className="text-gray-400" />
                                Dari Guru BK: <strong>{batch.school?.name ?? "-"}</strong>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            <StatChip label="Total PIN" value={pins.length} color="blue" />
                            <StatChip label="Tes Selesai" value={usedCount} color="yellow" />
                            <StatChip label="Dianalisis" value={doneCount} color="green" />
                        </div>

                        {/* Progress */}
                        <div>
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Progress analisis</span>
                                <span>{usedCount > 0 ? Math.round((doneCount / usedCount) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-2 rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${usedCount > 0 ? Math.round((doneCount / usedCount) * 100) : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screening list */}
                <div className="col-span-12 md:col-span-8">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-700">
                            <LuClipboardList size={16} className="text-gray-400" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                Daftar Screening ({usedCount} tes selesai)
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3">Siswa</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Tanggal Tes</th>
                                        <th className="px-4 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {pins.map((pin) => (
                                        <PinScreeningRow
                                            key={pin.id}
                                            pin={pin}
                                            onAnalyze={() => handleView(pin)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function PinScreeningRow({
    pin,
    onAnalyze,
}: {
    pin: StudentPin;
    onAnalyze: () => void;
}) {
    const isUsed    = !!pin.used_at;
    const isDone    = pin.screening?.status === "Selesai Dievaluasi";
    const isPending = isUsed && !isDone;

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800 dark:text-white">
                    {pin.subject?.name ?? "-"}
                </p>
                {pin.subject?.nis && <p className="text-xs text-gray-400">NIS: {pin.subject.nis}</p>}
            </td>
            <td className="px-4 py-3">
                {!isUsed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        Belum Tes
                    </span>
                )}
                {isPending && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        <LuClock size={10} />
                        Menunggu Analisis
                    </span>
                )}
                {isDone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <LuCircleCheck size={10} />
                        Selesai
                    </span>
                )}
            </td>
            <td className="px-4 py-3 text-xs text-gray-500">
                {pin.screening?.date_taken
                    ? new Date(pin.screening.date_taken).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                      })
                    : "-"}
            </td>
            <td className="px-4 py-3">
                {isUsed && (
                    <a
                        href={route("screening.batch.screening", {
                            batch: pin.batch_id,
                            screening: pin.screening?.id,
                        })}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                    >
                        {isDone ? "Lihat Analisis" : "Analisis"}
                    </a>
                )}
            </td>
        </tr>
    );
}

function StatChip({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: "blue" | "yellow" | "green";
}) {
    const bg = {
        blue:   "bg-blue-50 text-blue-700",
        yellow: "bg-yellow-50 text-yellow-700",
        green:  "bg-green-50 text-green-700",
    };
    return (
        <div className={`rounded-xl p-2 text-center ${bg[color]}`}>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    );
}
