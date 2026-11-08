import { router } from "@inertiajs/react";
import ActionDropdown from "@/shared/components/ui/dropdown/ActionDropdown";

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
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">ㅤ</TableCell>
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
                                    <ActionDropdown
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
