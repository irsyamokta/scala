import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoEyeOutline } from "react-icons/io5";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import Checkbox from "@/shared/components/forms/Checkbox";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { useDelete } from "@/shared/hooks/useDelete";
import { categoryColor } from "@/shared/constants/screening";
import { Subject } from "@/types/subject";

interface SubjectStudentTableProps {
    subjects: Subject[];
    selected: string[];
    allChecked: boolean;
    onToggleAll: () => void;
    onToggleOne: (id: string) => void;
    onEdit: (subject: Subject) => void;
}

export default function SubjectStudentTable({
    subjects,
    selected,
    allChecked,
    onToggleAll,
    onToggleOne,
    onEdit,
}: SubjectStudentTableProps) {
    const { handleDelete } = useDelete({
        routeName: "subject.destroy",
        confirmTitle: "Hapus Data Siswa?",
        confirmText: "Jika Anda menghapus data siswa ini, maka seluruh riwayat tes yang sudah dilakukan akan ikut terhapus.",
        successMessage: "Data siswa berhasil dihapus",
        errorMessage: "Gagal menghapus data siswa",
    });

    return (
        <div className="border border-netral-300 rounded-xl overflow-hidden mt-6">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-netral-300">
                        <TableRow>
                            <TableCell isHeader className="px-4 py-3 w-10">
                                <Checkbox checked={allChecked} onChange={onToggleAll} label="" />
                            </TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Nama</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">NIS</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Jenis Kelamin</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Tanggal Lahir</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Usia</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Kelas</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Hasil Terakhir</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Aksi</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {subjects.length === 0 ? (
                            <EmptyTable colspan={9} description="Tidak ditemukan data siswa." />
                        ) : subjects.map((subject) => (
                            <TableRow key={subject.id} className="border-b border-netral-300">
                                <TableCell className="px-4 py-3 w-10">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selected.includes(subject.id)}
                                            onChange={() => onToggleOne(subject.id)}
                                            label=""
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">{subject.name}</TableCell>
                                <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">{subject.nis ?? "-"}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <Badge color={subject.gender === "female" ? "pink" : "info"} size="sm">
                                        {subject.gender === "female" ? "Perempuan" : "Laki-laki"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                    {subject.tanggal_lahir
                                        ? new Date(subject.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                        : "-"}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">{subject.age} Tahun</TableCell>
                                <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">{subject.class?.class_name ?? "-"}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    {subject.last_result ? (
                                        <Badge color={categoryColor[subject.last_result] ?? "secondary"} size="sm">
                                            {subject.last_result}
                                        </Badge>
                                    ) : (
                                        <span className="text-netral-500">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <SubjectActionMenu
                                        onView={() => router.visit(route("subject.school.show", subject.id))}
                                        onEdit={() => onEdit(subject)}
                                        onDelete={() => handleDelete(subject.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function SubjectActionMenu({ onView, onEdit, onDelete }: {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [pos, setPos]   = useState({ top: 0, left: 0 });
    const btnRef          = useRef<HTMLButtonElement>(null);
    const menuRef         = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    function toggle() {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const menuH = 130;
        const openUp = window.innerHeight - rect.bottom < menuH;
        setPos({ top: openUp ? rect.top - menuH : rect.bottom + 4, left: rect.right - 180 });
        setOpen((v) => !v);
    }

    const menu = (
        <div ref={menuRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: 180 }}
            className="z-50 bg-netral-100 border border-netral-200 rounded-xl shadow-lg overflow-hidden">
            <button onClick={() => { onView(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-netral-700">
                <IoEyeOutline size={15} /> Lihat
            </button>
            <div className="border-t border-netral-200" />
            <button onClick={() => { onEdit(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-netral-700">
                <LuPencil size={14} /> Ubah
            </button>
            <div className="border-t border-netral-200" />
            <button onClick={() => { onDelete(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-red-500">
                <LuTrash2 size={14} /> Hapus
            </button>
        </div>
    );

    return (
        <>
            <button ref={btnRef} onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-netral-200 transition">
                <HiDotsHorizontal size={16} />
            </button>
            {open && createPortal(menu, document.body)}
        </>
    );
}
