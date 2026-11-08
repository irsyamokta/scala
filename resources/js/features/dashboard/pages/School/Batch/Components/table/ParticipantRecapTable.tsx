import { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/forms/Select";
import FilterBar from "@/shared/components/filter/FilterBar";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { PER_PAGE_OPTIONS } from "@/shared/constants/filterOptions";
import { formatDateTime } from "@/shared/utils/formatDate";
import { BatchSubject } from "@/types/batch";
import { ScreeningResult } from "@/types/screening";
import { IoEyeOutline } from "react-icons/io5";

interface ParticipantRecapTableProps {
    participants: BatchSubject[];
    onView: (screening: ScreeningResult) => void;
    actions?: React.ReactNode;
}

const categoryColor: Record<string, "success" | "warning" | "error"> = {
    Normal:     "success",
    Borderline: "warning",
    Abnormal:   "error",
};

export default function ParticipantRecapTable({ participants, onView, actions }: ParticipantRecapTableProps) {
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const filteredParticipants = useMemo(() => {
        const query = search.toLowerCase().trim();

        return participants.filter((subject) => {
            const record    = subject.batch_entries[0];
            const screening = record?.screening as any;
            const sdq       = screening?.sdq_result;
            const isDone    = screening?.status === "Selesai Dievaluasi";
            const cat       = sdq?.overall_category;

            const matchesSearch =
                !query ||
                subject.name.toLowerCase().includes(query) ||
                (subject.nis && subject.nis.toLowerCase().includes(query));

            const matchesCategory =
                categoryFilter.length === 0 ||
                (cat && categoryFilter.includes(cat));

            const statusAnalisa = !record ? "belum" : isDone ? "selesai" : "menunggu";
            const matchesStatus =
                statusFilter.length === 0 ||
                statusFilter.includes(statusAnalisa);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [participants, search, categoryFilter, statusFilter]);

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
                    filters={[
                        {
                            label: "Kategori",
                            value: categoryFilter,
                            options: [
                                { value: "Normal", label: "Normal" },
                                { value: "Borderline", label: "Borderline" },
                                { value: "Abnormal", label: "Abnormal" },
                            ],
                            onChange: (val) => {
                                setCategoryFilter(val);
                                setCurrentPage(1);
                            },
                        },
                        {
                            label: "Status Analisis",
                            value: statusFilter,
                            options: [
                                { value: "selesai", label: "Selesai" },
                                { value: "menunggu", label: "Menunggu" },
                                { value: "belum", label: "Belum Tes" },
                            ],
                            onChange: (val) => {
                                setStatusFilter(val);
                                setCurrentPage(1);
                            },
                        },
                    ]}
                />
            </div>

            <div className="border border-netral-300 rounded-xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-netral-300">
                            <TableRow>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">No</TableCell>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Nama Siswa</TableCell>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Tanggal Tes</TableCell>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Kategori</TableCell>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Status Analisis</TableCell>
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Detail</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedParticipants.length === 0 ? (
                                <EmptyTable colspan={6} description="Tidak ditemukan data." />
                            ) : paginatedParticipants.map((subject, i) => {
                                const record    = subject.batch_entries[0];
                                const screening = record?.screening as any;
                                const sdq       = screening?.sdq_result;
                                const isDone    = screening?.status === "Selesai Dievaluasi";
                                const cat       = sdq?.overall_category;

                                return (
                                    <TableRow key={subject.id} className="border-b border-netral-300">
                                        <TableCell className="px-6 py-4 text-sm text-netral-600">
                                            {startIndex + i + 1}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                            {subject.name}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {screening?.date_taken
                                                ? formatDateTime(screening.date_taken)
                                                : <span className="italic text-netral-500">Belum tes</span>}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {cat
                                                ? <Badge color={categoryColor[cat] ?? "dark"} size="sm">{cat}</Badge>
                                                : <span className="text-netral-400">-</span>}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {! record
                                                ? <span className="text-sm italic text-netral-500">Belum tes</span>
                                                : <Badge color={isDone ? "success" : "warning"} size="sm">
                                                    {isDone ? "Selesai" : "Menunggu"}
                                                  </Badge>}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {screening ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<IoEyeOutline size={14} />}
                                                    onClick={() => onView(screening as ScreeningResult)}
                                                >
                                                    Lihat Detail
                                                </Button>
                                            ) : (
                                                <span className="text-sm italic text-netral-400">-</span>
                                            )}
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
