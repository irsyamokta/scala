import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LuKeyRound,
    LuCircleCheck,
    LuClock,
    LuLock,
    LuChevronRight,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import InputField from "@/shared/components/forms/InputField";
import Select from "@/shared/components/forms/Select";
import { Batch, PaginatedResponse } from "@/types/batch";
import { PageProps } from "@/types";

interface SuperadminBatchPageProps extends PageProps {
    batches: PaginatedResponse<Batch>;
    stats: {
        total: number;
        active: number;
        closed: number;
        assigned: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: number;
    };
}

export default function SuperadminBatchIndex() {
    const { batches, stats, filters } = usePage<SuperadminBatchPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");

    function applyFilter() {
        router.get(
            route("admin.batch.index"),
            { search: search || undefined, status: status || undefined },
            { preserveState: true, replace: true }
        );
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") applyFilter();
    }

    return (
        <DashboardLayout title="Semua Batch Skrining">
            <Head title="Semua Batch Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                {/* Header */}
                <div className="col-span-12">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Semua Batch Skrining
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Monitoring seluruh batch skrining dari semua sekolah.
                    </p>
                </div>

                {/* Stats */}
                <div className="col-span-6 lg:col-span-3">
                    <StatCard label="Total Batch" value={stats.total} color="blue" icon={<LuKeyRound size={20} />} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard label="Aktif" value={stats.active} color="green" icon={<LuClock size={20} />} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard label="Sudah Ditutup" value={stats.closed} color="gray" icon={<LuLock size={20} />} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard label="Sudah Assigned" value={stats.assigned} color="purple" icon={<LuCircleCheck size={20} />} />
                </div>

                {/* Filters */}
                <div className="col-span-12 flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <InputField
                            placeholder="Cari label batch atau nama sekolah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="min-w-[160px]">
                        <Select
                            placeholder="Semua Status"
                            options={[
                                { value: "active", label: "Aktif" },
                                { value: "closed", label: "Ditutup" },
                            ]}
                            value={status}
                            onChange={(val) => {
                                const v = String(val);
                                setStatus(v);
                                router.get(
                                    route("admin.batch.index"),
                                    { search: search || undefined, status: v || undefined },
                                    { preserveState: true, replace: true }
                                );
                            }}
                        />
                    </div>

                    <button
                        onClick={applyFilter}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition"
                    >
                        Cari
                    </button>
                </div>

                {/* Table */}
                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3">Label Batch</th>
                                        <th className="px-4 py-3">Sekolah</th>
                                        <th className="px-4 py-3">Kelas</th>
                                        <th className="px-4 py-3">Instrumen</th>
                                        <th className="px-4 py-3">Progress</th>
                                        <th className="px-4 py-3">Psikolog</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {batches.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                                                Tidak ada data.
                                            </td>
                                        </tr>
                                    ) : batches.data.map((batch) => (
                                        <BatchRow key={batch.id} batch={batch} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {batches.last_page > 1 && (
                        <div className="mt-4 flex justify-center gap-1">
                            {batches.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    className={`min-w-[36px] rounded-lg px-3 py-1.5 text-sm transition ${
                                        link.active
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function BatchRow({ batch }: { batch: Batch }) {
    const used  = batch.tested_count ?? 0;
    const total = batch.total_subjects ?? 0;
    const pct   = total > 0 ? Math.round((used / total) * 100) : 0;
    const isClosed = batch.status === "closed";

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800 dark:text-white">{batch.label}</p>
                {batch.expires_at && (
                    <p className="text-xs text-gray-400 mt-0.5">
                        Exp: {new Date(batch.expires_at).toLocaleDateString("id-ID")}
                    </p>
                )}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {batch.school?.name ?? "-"}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {batch.class?.class_name ?? "-"}
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    batch.instrument?.name === "SDQ"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-violet-100 text-violet-700"
                }`}>
                    {batch.instrument?.name ?? "-"}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-gray-200">
                        <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{used}/{total}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {batch.assigned_psychologist?.name ?? (
                    <span className="text-gray-300 italic text-xs">Belum</span>
                )}
            </td>
            <td className="px-4 py-3">
                {isClosed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        <LuLock size={10} /> Ditutup
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <LuClock size={10} /> Aktif
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                <a
                    href={route("batch.show", batch.id)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    Detail <LuChevronRight size={12} />
                </a>
            </td>
        </tr>
    );
}

function StatCard({
    label, value, color, icon,
}: {
    label: string;
    value: number;
    color: "blue" | "green" | "gray" | "purple";
    icon: React.ReactNode;
}) {
    const colors = {
        blue:   "bg-blue-50 text-blue-600",
        green:  "bg-green-50 text-green-600",
        gray:   "bg-gray-100 text-gray-600",
        purple: "bg-purple-50 text-purple-600",
    };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className={`mb-2 inline-flex rounded-xl p-2 ${colors[color]}`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}
