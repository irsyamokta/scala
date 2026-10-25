import { Head, usePage } from "@inertiajs/react";
import {
    LuClipboardList,
    LuCalendar,
    LuArrowLeft,
    LuCircleCheck,
    LuClock,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { StudentResultPageProps } from "@/types/batch";

export default function StudentResult() {
    const { screening } = usePage<StudentResultPageProps>().props;
    const sdq = screening.sdq_result;
    const isFinished = screening.status === "Selesai";

    const categoryColor: Record<string, string> = {
        Normal: "bg-green-100 text-green-700 border-green-200",
        Borderline: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Abnormal: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <DashboardLayout title="Hasil Tes">
            <Head title="Hasil Tes Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* Back */}
                <div className="col-span-12">
                    <a
                        href={route("student.dashboard")}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-primary"
                    >
                        <LuArrowLeft size={15} />
                        Kembali ke Dashboard
                    </a>
                </div>

                {/* Meta info */}
                <div className="col-span-12 md:col-span-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Informasi Tes
                        </h2>

                        <InfoRow
                            icon={<LuClipboardList size={16} />}
                            label="Instrumen"
                            value={screening.instrument?.name ?? "-"}
                        />
                        <InfoRow
                            icon={<LuCalendar size={16} />}
                            label="Tanggal Tes"
                            value={new Date(screening.date_taken).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        />

                        {/* Status */}
                        <div className="flex items-center gap-2 pt-2">
                            {isFinished ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    <LuCircleCheck size={12} />
                                    Selesai Dianalisis
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                                    <LuClock size={12} />
                                    {screening.status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hasil SDQ */}
                <div className="col-span-12 md:col-span-7">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 space-y-5">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Hasil Skrining
                        </h2>

                        {!sdq ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <LuClock size={36} className="mb-3 opacity-30" />
                                <p className="text-sm text-center">
                                    Hasil sedang dianalisis oleh psikolog.
                                    <br />
                                    Pantau halaman ini secara berkala.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Kategori */}
                                <div
                                    className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
                                        categoryColor[sdq.overall_category] ??
                                        "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                                >
                                    <span className="text-sm font-medium">Kategori Keseluruhan</span>
                                    <span className="text-base font-bold">
                                        {sdq.overall_category}
                                    </span>
                                </div>

                                {/* Skor domain */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <ScoreCard label="Emosional" value={sdq.emotional_score} />
                                    <ScoreCard label="Perilaku" value={sdq.conduct_score} />
                                    <ScoreCard label="Hiperaktivitas" value={sdq.hyperactivity_score} />
                                    <ScoreCard label="Teman Sebaya" value={sdq.peer_score} />
                                    <ScoreCard label="Prososial" value={sdq.prosocial_score} />
                                    <ScoreCard
                                        label="Total Kesulitan"
                                        value={sdq.total_difficulties}
                                        highlight
                                    />
                                </div>

                                {/* Rekomendasi */}
                                {sdq.recommendation ? (
                                    <div className="rounded-xl bg-blue-50 px-4 py-4 dark:bg-blue-900/20">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                            Rekomendasi Psikolog
                                        </p>
                                        {sdq.psychologist && (
                                            <p className="mb-2 text-xs text-blue-500">
                                                oleh {sdq.psychologist.name}
                                                {sdq.date_analysis && (
                                                    <> · {new Date(sdq.date_analysis).toLocaleDateString("id-ID")}</>
                                                )}
                                            </p>
                                        )}
                                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                                            {sdq.recommendation}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Rekomendasi psikolog belum tersedia.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-gray-400">{icon}</span>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

function ScoreCard({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: number;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border p-3 text-center ${
                highlight
                    ? "border-primary/30 bg-primary/5"
                    : "border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            }`}
        >
            <p
                className={`text-xl font-bold ${
                    highlight ? "text-primary" : "text-gray-800 dark:text-white"
                }`}
            >
                {value ?? "-"}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
        </div>
    );
}
