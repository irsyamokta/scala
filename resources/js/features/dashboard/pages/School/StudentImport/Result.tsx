import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    LuCircleCheck,
    LuCircleX,
    LuArrowLeft,
    LuUsers,
    LuTriangleAlert,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    ImportSuccessRow,
    ImportFailureRow,
    StudentImportResultPageProps,
} from "@/types/student-import";

export default function Result() {
    const { result } = usePage<StudentImportResultPageProps>().props;

    const [activeTab, setActiveTab] = useState<"success" | "failure">(
        result.failure_count > 0 ? "failure" : "success"
    );

    return (
        <DashboardLayout title="Hasil Import Siswa">
            <Head title="Hasil Import Siswa" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* Summary Cards */}
                <div className="col-span-12 sm:col-span-4">
                    <SummaryCard
                        icon={<LuUsers size={24} />}
                        label="Total Diproses"
                        value={result.success_count + result.failure_count}
                        color="blue"
                    />
                </div>
                <div className="col-span-12 sm:col-span-4">
                    <SummaryCard
                        icon={<LuCircleCheck size={24} />}
                        label="Berhasil Ditambahkan"
                        value={result.success_count}
                        color="green"
                    />
                </div>
                <div className="col-span-12 sm:col-span-4">
                    <SummaryCard
                        icon={<LuCircleX size={24} />}
                        label="Gagal"
                        value={result.failure_count}
                        color="red"
                    />
                </div>

                {/* Actions */}
                <div className="col-span-12 flex flex-wrap items-center gap-3">
                    <a
                        href={route("subject.school.index")}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition"
                    >
                        <LuUsers size={15} />
                        Lihat Daftar Siswa
                    </a>
                    <a
                        href={route("subject.school.index")}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300"
                    >
                        <LuArrowLeft size={15} />
                        Import Lagi
                    </a>
                </div>

                {/* Detail Table */}
                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <TabButton
                                active={activeTab === "success"}
                                onClick={() => setActiveTab("success")}
                                label={`Berhasil (${result.success_count})`}
                                color="green"
                            />
                            <TabButton
                                active={activeTab === "failure"}
                                onClick={() => setActiveTab("failure")}
                                label={`Gagal (${result.failure_count})`}
                                color="red"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            {activeTab === "success" ? (
                                <SuccessTable rows={result.successes} />
                            ) : (
                                <FailureTable rows={result.failures} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function SummaryCard({
    icon, label, value, color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: "blue" | "green" | "red";
}) {
    const colors = {
        blue:  "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        red:   "bg-red-50 text-red-600",
    };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}

function TabButton({
    active, onClick, label, color,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    color: "green" | "red";
}) {
    const activeColors = {
        green: "border-green-500 text-green-600",
        red:   "border-red-500 text-red-600",
    };
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                active
                    ? `${activeColors[color]} bg-white dark:bg-gray-900`
                    : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
            {label}
        </button>
    );
}

function SuccessTable({ rows }: { rows: ImportSuccessRow[] }) {
    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <LuCircleCheck size={40} className="mb-3 opacity-40" />
                <p className="text-sm">Tidak ada data berhasil.</p>
            </div>
        );
    }

    return (
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">NIS</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map((row, i) => (
                    <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                            {row.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {row.nis || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {row.class}
                        </td>
                        <td className="px-4 py-3">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    row.is_new
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {row.is_new ? "Data Baru" : "Diperbarui"}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function FailureTable({ rows }: { rows: ImportFailureRow[] }) {
    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <LuCircleCheck size={40} className="mb-3 text-green-400 opacity-70" />
                <p className="text-sm">Semua baris berhasil diimport!</p>
            </div>
        );
    }

    return (
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                <tr>
                    <th className="px-4 py-3">Baris</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Keterangan Error</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map((row, i) => (
                    <tr
                        key={i}
                        className="hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                    >
                        <td className="px-4 py-3 text-gray-400">{row.row}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                            {row.name || "-"}
                        </td>
                        <td className="px-4 py-3">
                            <ul className="space-y-1">
                                {row.errors.map((err, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-1.5 text-red-600 dark:text-red-400"
                                    >
                                        <LuTriangleAlert size={13} className="mt-0.5 shrink-0" />
                                        {err}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
