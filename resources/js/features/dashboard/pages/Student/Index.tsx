import { Head, usePage } from "@inertiajs/react";
import {
    LuClipboardList,
    LuCircleCheck,
    LuClock,
    LuChevronRight,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { StudentDashboardPageProps } from "@/types/pin-batch";

export default function StudentDashboard() {
    const { screening_history } = usePage<StudentDashboardPageProps>().props;

    return (
        <DashboardLayout title="Dashboard Siswa">
            <Head title="Dashboard Siswa" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                <div className="col-span-12">
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
                                <p className="mt-1 text-xs text-gray-400">
                                    Scan QR code dari Guru BK untuk memulai tes.
                                </p>
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
                                                    Tes Skrining {s.instrument?.name}
                                                </p>
                                                <p className="flex items-center gap-1 text-xs text-gray-400">
                                                    <LuClock size={11} />
                                                    {new Date(s.date_taken).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge
                                                    status={s.status}
                                                    result={s.sdq_result?.overall_category}
                                                />
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

function StatusBadge({ status, result }: { status: string; result?: string }) {
    if (status === "Selesai" && result) {
        const colors: Record<string, string> = {
            Normal:     "bg-green-100 text-green-700",
            Borderline: "bg-yellow-100 text-yellow-700",
            Abnormal:   "bg-red-100 text-red-700",
        };
        return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[result] ?? "bg-gray-100 text-gray-700"}`}>
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
