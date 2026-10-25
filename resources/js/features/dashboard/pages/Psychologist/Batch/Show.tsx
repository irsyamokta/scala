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
import { BatchShowPageProps, BatchSubject, BatchParticipant } from "@/types/batch";
import { ScreeningResult } from "@/types/screening";
import ScreeningDetailModal from "../Screening/Components/modal/ScreeningModal";

export default function PsychologistBatchShow() {
    const { batch, participants } = usePage<BatchShowPageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<ScreeningResult | null>(null);

    const testedCount = participants.filter((s) => s.batch_entries.length > 0).length;
    const doneCount   = participants.filter(
        (s) => s.batch_entries[0]?.screening?.status === "Selesai Dievaluasi"
    ).length;

    function handleView(subject: BatchSubject) {
        const record = subject.batch_entries[0];
        if (!record?.screening_id) return;
        window.location.href = route("screening.batch.screening", {
            batch: batch.id,
            screening: record.screening_id,
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

                <div className="col-span-12 flex items-center gap-3">
                    <a
                        href={route("batch.index")}
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

                <div className="col-span-12 md:col-span-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 space-y-4">
                        <h2 className="font-bold text-gray-800 dark:text-white">{batch.label}</h2>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p className="flex items-center gap-2">
                                <LuUsers size={14} className="text-gray-400" />
                                Kelas: <strong>{batch.class?.class_name ?? "Semua Kelas"}</strong>
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

                        <div className="grid grid-cols-3 gap-2 pt-2">
                            <StatChip label="Total Siswa" value={participants.length} color="blue" />
                            <StatChip label="Sudah Tes" value={testedCount} color="yellow" />
                            <StatChip label="Dianalisis" value={doneCount} color="green" />
                        </div>

                        <div>
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Progress analisis</span>
                                <span>{testedCount > 0 ? Math.round((doneCount / testedCount) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-2 rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${testedCount > 0 ? Math.round((doneCount / testedCount) * 100) : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-8">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-700">
                            <LuClipboardList size={16} className="text-gray-400" />
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                Daftar Peserta ({testedCount} tes selesai)
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
                                    {participants.map((subject) => (
                                        <ParticipantRow
                                            key={subject.id}
                                            subject={subject}
                                            onAnalyze={() => handleView(subject)}
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

function ParticipantRow({
    subject,
    onAnalyze,
}: {
    subject: BatchSubject;
    onAnalyze: () => void;
}) {
    const record    = subject.batch_entries[0] as BatchParticipant | undefined;
    const hasTested = !!record;
    const isDone    = record?.screening?.status === "Selesai Dievaluasi";
    const isPending = hasTested && !isDone;

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800 dark:text-white">{subject.name}</p>
                {subject.nis && <p className="text-xs text-gray-400">NIS: {subject.nis}</p>}
            </td>
            <td className="px-4 py-3">
                {!hasTested && (
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
                {record?.screening?.date_taken
                    ? new Date(record.screening.date_taken).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })
                    : "-"}
            </td>
            <td className="px-4 py-3">
                {hasTested && (
                    <button
                        onClick={onAnalyze}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                    >
                        {isDone ? "Lihat Analisis" : "Analisis"}
                    </button>
                )}
            </td>
        </tr>
    );
}

function StatChip({ label, value, color }: { label: string; value: number; color: "blue" | "yellow" | "green" }) {
    const bg = { blue: "bg-blue-50 text-blue-700", yellow: "bg-yellow-50 text-yellow-700", green: "bg-green-50 text-green-700" };
    return (
        <div className={`rounded-xl p-2 text-center ${bg[color]}`}>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    );
}
