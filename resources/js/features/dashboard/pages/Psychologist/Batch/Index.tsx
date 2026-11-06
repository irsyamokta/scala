import { Head, router, usePage } from "@inertiajs/react";
import { LuChevronRight } from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
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
import { Batch, BatchIndexPageProps } from "@/types/batch";
import { capitalized } from "@/shared/utils/capitalize";

export default function PsychologistBatchIndex() {
    const { batches } = usePage<BatchIndexPageProps>().props;

    return (
        <DashboardLayout title="Batch Skrining">
            <Head title="Batch Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-netral-900">
                                Batch Skrining
                            </h2>
                            <p className="text-sm text-netral-600 mt-1">
                                Daftar batch yang ditugaskan kepada Anda untuk dianalisis.
                            </p>
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
                                                Status
                                            </TableCell>
                                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                                {" "}
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.data.length === 0 ? (
                                            <EmptyTable
                                                colspan={7}
                                                description="Belum ada batch yang ditugaskan."
                                            />
                                        ) : batches.data.map((batch) => (
                                            <BatchRow key={batch.id} batch={batch} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <Pagination
                            links={batches.links}
                            filters={{}}
                            routeName="batch.index"
                        />
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
        <TableRow
            onClick={() => router.visit(route("batch.show", batch.id))}
            className="border-netral-300 border-b hover:bg-netral-200/70 transition-colors cursor-pointer group"
        >
            <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
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
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <Badge color={isClosed ? "dark" : "warning"} size="sm">
                    {isClosed ? "Selesai" : "Perlu Analisis"}
                </Badge>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <a
                    href={route("batch.show", batch.id)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    Lihat <LuChevronRight size={12} />
                </a>
            </TableCell>
        </TableRow>
    );
}
