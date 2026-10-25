import { Head, router, usePage } from "@inertiajs/react";
import {
    LuKeyRound,
    LuUsers,
    LuCircleCheck,
    LuClock,
    LuChevronRight,
    LuClipboardList,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { PinBatch as Batch, PinBatchIndexPageProps as BatchIndexPageProps } from "@/types/pin-batch";

export default function PsychologistBatchIndex() {
    const { batches } = usePage<BatchIndexPageProps>().props;

    return (
        <DashboardLayout title="Batch Skrining">
            <Head title="Batch Skrining" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">

                <div className="col-span-12">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                            Batch Skrining
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Daftar batch yang di-assign kepada Anda untuk dianalisis.
                        </p>
                    </div>
                </div>

                <div className="col-span-12">
                    {batches.data.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-3">
                            {batches.data.map((batch) => (
                                <BatchCard key={batch.id} batch={batch} />
                            ))}
                        </div>
                    )}

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

function BatchCard({ batch }: { batch: Batch }) {
    const usedCount  = batch.tested_count ?? 0;
    const totalCount = batch.total_subjects ?? 0;
    const pct        = totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0;

    return (
        <a
            href={route("batch.show", batch.id)}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:border-primary/30 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LuKeyRound size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-gray-800 dark:text-white">
                    {batch.label}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <LuUsers size={11} />
                        {batch.class?.class_name ?? "-"}
                    </span>
                    <span>{batch.instrument?.name ?? "-"}</span>
                    <span className="text-gray-400">dari {batch.school?.name ?? "-"}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                        {usedCount}/{totalCount} selesai
                    </span>
                </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
                <BatchStatusBadge status={batch.status} />
            </div>

            <LuChevronRight size={16} className="shrink-0 text-gray-400" />
        </a>
    );
}

function BatchStatusBadge({ status }: { status: string }) {
    if (status === "closed") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                <LuCircleCheck size={10} />
                Selesai
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
            <LuClock size={10} />
            Perlu Analisis
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-gray-400 dark:border-gray-700">
            <LuClipboardList size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Belum ada batch yang di-assign.</p>
            <p className="mt-1 text-xs">Hubungi Guru BK untuk meng-assign batch.</p>
        </div>
    );
}
