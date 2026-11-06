import { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import Select from "@/shared/components/forms/Select";
import FilterBar from "@/shared/components/filter/FilterBar";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { PER_PAGE_OPTIONS } from "@/shared/constants/filterOptions";
import { BatchSubject } from "@/types/batch";

interface ParticipantTableProps {
    participants: BatchSubject[];
    actions?: React.ReactNode;
}

export default function ParticipantTable({ participants, actions }: ParticipantTableProps) {
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const filteredParticipants = useMemo(() => {
        const query = search.toLowerCase().trim();

        return participants.filter((subject) => {
            const hasTested = subject.batch_entries.length > 0;

            const matchesSearch =
                !query ||
                subject.name.toLowerCase().includes(query) ||
                (subject.nis && subject.nis.toLowerCase().includes(query));

            const matchesStatus =
                statusFilter.length === 0 ||
                (statusFilter.includes("sudah") && hasTested) ||
                (statusFilter.includes("belum") && !hasTested);

            return matchesSearch && matchesStatus;
        });
    }, [participants, search, statusFilter]);

    const total = filteredParticipants.length;
    const totalPages = Math.ceil(total / perPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handlePerPageChange = (val: string | boolean | number) => {
        setPerPage(Number(val));
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * perPage;
    const paginatedParticipants = filteredParticipants.slice(startIndex, startIndex + perPage);

    return (
        <div>
            {/* Toolbar: Per Page (Left) & Search/Filter (Right) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 shrink-0">
                    <Select
                        value={perPage}
                        placeholder="10"
                        onChange={handlePerPageChange}
                        className="max-w-18"
                        options={PER_PAGE_OPTIONS}
                    />
                    {actions}
                </div>

                <FilterBar
                    className="w-full sm:w-auto"
                    search={{
                        value: search,
                        placeholder: "Cari nama atau NIS...",
                        onChange: (val) => {
                            setSearch(val);
                            setCurrentPage(1);
                        },
                    }}
                    filter={{
                        label: "Status Tes",
                        value: statusFilter,
                        options: [
                            { value: "sudah", label: "Sudah Tes" },
                            { value: "belum", label: "Belum Tes" },
                        ],
                        onChange: (val) => {
                            setStatusFilter(val);
                            setCurrentPage(1);
                        },
                    }}
                />
            </div>

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
                            {paginatedParticipants.length === 0 ? (
                                <EmptyTable colspan={5} description="Tidak ditemukan data siswa." />
                            ) : paginatedParticipants.map((subject, i) => {
                                const hasTested = subject.batch_entries.length > 0;

                                return (
                                    <TableRow key={subject.id} className="border-b border-netral-300">
                                        <TableCell className="px-6 py-4 text-sm text-netral-600">
                                            {startIndex + i + 1}
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

            {/* Footer: Pagination */}
            <div className="flex justify-center items-center mt-6">
                <Pagination
                    currentPage={currentPage}
                    lastPage={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}
