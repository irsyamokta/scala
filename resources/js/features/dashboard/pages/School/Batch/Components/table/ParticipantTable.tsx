import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { BatchSubject } from "@/types/batch";

interface ParticipantTableProps {
    participants: BatchSubject[];
}

export default function ParticipantTable({ participants }: ParticipantTableProps) {
    return (
        <div className="border border-netral-300 rounded-xl overflow-hidden">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-netral-300">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">No</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Nama Siswa</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">NIS</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Kelas</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Status Tes</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {participants.length === 0 ? (
                            <EmptyTable colspan={5} description="Belum ada data siswa." />
                        ) : participants.map((subject, i) => {
                            const hasTested = subject.batch_entries.length > 0;

                            return (
                                <TableRow key={subject.id} className="border-b border-netral-300">
                                    <TableCell className="px-6 py-4 text-sm text-netral-600">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                        {subject.name}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-netral-600">
                                        {subject.nis ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                        {subject.class?.class_name ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Badge color={hasTested ? "success" : "light"} size="sm">
                                            {hasTested ? "Sudah Tes" : "Belum Tes"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
