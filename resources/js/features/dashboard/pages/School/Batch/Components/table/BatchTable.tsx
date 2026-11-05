import { router } from "@inertiajs/react";
import { LuKeyRound, LuUsers, LuChevronRight, LuLock, LuTrash2, LuPencil } from "react-icons/lu";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import Checkbox from "@/shared/components/forms/Checkbox";
import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import { Batch, PaginatedResponse } from "@/types/batch";

interface BatchTableProps {
    batches: PaginatedResponse<Batch>;
    selected: string[];
    allChecked: boolean;
    onToggleAll: () => void;
    onToggleOne: (id: string) => void;
    onEdit?: (batch: Batch) => void;
    canDelete?: boolean;
}

export default function BatchTable({
    batches,
    selected,
    allChecked,
    onToggleAll,
    onToggleOne,
    onEdit,
    canDelete = false,
}: BatchTableProps) {
    if (batches.data.length === 0) return null;

    return (
        <div>
            <div className="border border-netral-300 rounded-xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-netral-300">
                            <TableRow>
                                {canDelete && (
                                    <TableCell isHeader className="px-4 py-3 w-10">
                                        <Checkbox
                                            checked={allChecked}
                                            onChange={onToggleAll}
                                            label=""
                                        />
                                    </TableCell>
                                )}
                                <TableCell isHeader className="px-4 py-3" colSpan={1}>
                                    <span className="text-sm font-semibold text-netral-900 text-start">
                                        Batch
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.data.map((batch) => (
                                <BatchItem
                                    key={batch.id}
                                    batch={batch}
                                    checked={selected.includes(batch.id)}
                                    onCheck={() => onToggleOne(batch.id)}
                                    onEdit={onEdit}
                                    canDelete={canDelete}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {batches.last_page > 1 && (
                <Pagination
                    links={batches.links}
                    filters={{}}
                    routeName="batch.index"
                />
            )}
        </div>
    );
}

function BatchItem({
    batch,
    checked,
    onCheck,
    onEdit,
    canDelete,
}: {
    batch: Batch;
    checked: boolean;
    onCheck: () => void;
    onEdit?: (batch: Batch) => void;
    canDelete: boolean;
}) {
    const isClosed   = batch.status === "closed";
    const isExpired  = batch.expires_at ? new Date(batch.expires_at) < new Date() : false;
    const usedCount  = batch.tested_count ?? 0;
    const totalCount = batch.total_subjects ?? 0;

    const statusColor: "success" | "error" | "info" | "dark" =
        isClosed ? "dark"
        : isExpired ? "error"
        : batch.assigned_psychologist_id ? "info"
        : "success";

    const statusLabel = isClosed ? "Ditutup"
        : isExpired ? "Kedaluwarsa"
        : batch.assigned_psychologist_id ? "Assigned"
        : "Aktif";

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = await ConfirmationDialog({
            title: "Hapus Batch Ini?",
            text: `"${batch.label}" beserta seluruh data terkait akan terhapus permanen.`,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirmed) return;

        router.delete(route("batch.destroy", batch.id));
    }

    return (
        <TableRow
            onClick={() => router.visit(route("batch.show", batch.id))}
            className="border-b border-netral-300 hover:bg-netral-200/40 transition-colors cursor-pointer group"
        >
            {/* Checkbox */}
            {canDelete && (
                <TableCell className="px-4 py-3 w-10">
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={checked} onChange={onCheck} label="" />
                    </div>
                </TableCell>
            )}

            {/* Icon */}
            <TableCell className="px-4 py-3 w-12">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    isClosed || isExpired
                        ? "bg-netral-200 text-netral-400"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105"
                }`}>
                    {isClosed ? <LuLock size={18} /> : <LuKeyRound size={18} />}
                </div>
            </TableCell>

            {/* Info */}
            <TableCell className="px-4 py-3 w-full">
                <p className="font-semibold text-netral-900 truncate group-hover:text-primary transition-colors">
                    {batch.label}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-netral-600">
                    <span className="flex items-center gap-1">
                        <LuUsers size={10} />
                        {batch.class?.class_name ?? "Semua Kelas"}
                    </span>
                    <span className="font-medium">{batch.instrument?.name ?? "-"}</span>
                    <span className="text-netral-600">
                        Dibuat {new Date(batch.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {batch.expires_at ? (
                        <span className={isExpired ? "text-red-500" : "text-netral-600"}>
                            {isExpired ? "Kedaluwarsa" : "Berlaku s/d"}{" "}
                            {new Date(batch.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                    ) : (
                        <span className="text-netral-600">Tidak ada batas waktu</span>
                    )}
                </div>
            </TableCell>

            {/* Status + Progress + Actions */}
            <TableCell className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2 justify-end">
                    {totalCount > 0 && (
                        <span className="text-xs text-netral-500 mr-1">{usedCount}/{totalCount} terpakai</span>
                    )}
                    <Badge color={statusColor} size="sm">{statusLabel}</Badge>

                    {/* Edit button */}
                    {onEdit && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit(batch);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-netral-500 hover:bg-netral-300/60 hover:text-netral-900 transition"
                            title="Edit batch"
                        >
                            <LuPencil size={15} />
                        </button>
                    )}

                    {/* Delete button — hanya untuk superadmin */}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Hapus batch"
                        >
                            <LuTrash2 size={15} />
                        </button>
                    )}

                    <div className="text-netral-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                        <LuChevronRight size={18} />
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}
