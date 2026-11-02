import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { LuChevronRight } from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import StatCard from "@/shared/components/card/StatCard";
import FilterBar from "@/shared/components/filter/FilterBar";
import Select from "@/shared/components/forms/Select";
import Badge from "@/shared/components/ui/badge/Badge";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { Batch, PaginatedResponse } from "@/types/batch";
import { PageProps } from "@/types";
import { PER_PAGE_OPTIONS } from "@/shared/constants/filterOptions";
import { capitalized } from "@/shared/utils/capitalize";

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

    function setFilter(key: string, value: string | number) {
        const payload: Record<string, string | number | undefined> = {
            search: search || undefined,
            status: status || undefined,
            per_page: filters.per_page ?? 10,
            [key]: value || undefined,
        };

        if (key === "search") setSearch(String(value));
        if (key === "status") setStatus(String(value));

        router.get(route("admin.batch.index"), payload, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <DashboardLayout title="Semua Batch Skrining">
            <Head title="Semua Batch Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-6 lg:col-span-3">
                    <StatCard title="Total Batch" value={stats.total} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard title="Aktif" value={stats.active} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard title="Sudah Ditutup" value={stats.closed} />
                </div>
                <div className="col-span-6 lg:col-span-3">
                    <StatCard title="Sudah Assigned" value={stats.assigned} />
                </div>

                <div className="col-span-12">
                    <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-netral-900">
                                    Daftar Batch
                                </h2>
                                <p className="text-sm text-netral-600 mt-1">
                                    Berikut adalah daftar batch skrining dari seluruh sekolah.
                                </p>
                            </div>

                            <div className="w-full md:w-auto flex items-center gap-2">
                                <FilterBar
                                    className="flex-1"
                                    search={{
                                        value: search,
                                        placeholder: "Cari label batch...",
                                        onChange: (value) => setSearch(value),
                                    }}
                                    filter={{
                                        label: "Status",
                                        value: status ? [status] : [],
                                        options: [
                                            { value: "active", label: "Aktif" },
                                            { value: "closed", label: "Ditutup" },
                                        ],
                                        onChange: (value) =>
                                            setFilter("status", Array.isArray(value) ? value[0] : value),
                                    }}
                                />
                            </div>
                        </div>

                        <div className="border border-netral-300 rounded-xl">
                            <div className="w-full overflow-x-auto overflow-y-visible">
                                <Table>
                                    <TableHeader className="border-netral-300 border-b">
                                        <TableRow>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Label Batch
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Sekolah
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Kelas
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Instrumen
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Progress
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Psikolog
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                Status
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                {" "}
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.data.length === 0 ? (
                                            <EmptyTable colspan={8} description="Tidak ada data batch." />
                                        ) : batches.data.map((batch) => (
                                            <BatchRow key={batch.id} batch={batch} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            <Select
                                value={filters.per_page ?? 10}
                                placeholder="10"
                                onChange={(value) => setFilter("per_page", Number(value))}
                                className="max-w-18 mt-6"
                                options={PER_PAGE_OPTIONS}
                            />

                            <Pagination
                                links={batches.links}
                                filters={{ search, status }}
                                routeName="admin.batch.index"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function BatchRow({ batch }: { batch: Batch }) {
    const used  = batch.tested_count ?? 0;
    const total = batch.total_subjects ?? 0;
    const pct   = total > 0 ? Math.round((used / total) * 100) : 0;
    const isClosed = batch.status === "closed";

    return (
        <TableRow key={batch.id} className="border-netral-300 border-b">
            <TableCell className="px-6 py-4 text-sm font-medium text-netral-900">
                <p>{batch.label}</p>
                {batch.expires_at && (
                    <p className="text-xs text-netral-500 mt-0.5">
                        Exp: {new Date(batch.expires_at).toLocaleDateString("id-ID")}
                    </p>
                )}
            </TableCell>
            <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                {capitalized(batch.school?.school_name ?? "-") ?? batch.school?.name ?? "-"}
            </TableCell>
            <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                {batch.class?.class_name ?? "-"}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <Badge color={batch.instrument?.name === "SDQ" ? "success" : "info"} size="sm">
                    {batch.instrument?.name ?? "-"}
                </Badge>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-netral-200">
                        <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="text-xs text-netral-500">{used}/{total}</span>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                {batch.assigned_psychologist?.name ?? (
                    <span className="text-netral-400 italic text-xs">Belum</span>
                )}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <Badge color={isClosed ? "dark" : "success"} size="sm">
                    {isClosed ? "Ditutup" : "Aktif"}
                </Badge>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <a
                    href={route("batch.show", batch.id)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    Detail <LuChevronRight size={12} />
                </a>
            </TableCell>
        </TableRow>
    );
}
