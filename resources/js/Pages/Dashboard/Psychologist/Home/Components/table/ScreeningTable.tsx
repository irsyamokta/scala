import { Link } from "@inertiajs/react";
import { PsychologistScreeningItem, PsychologistScreeningTableProps } from "@/types/screening";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";
import { EmptyTable } from "@/Components/empty/EmptyTable";

import { formatCalendarDate } from "@/utils/formatDate";
import { capitalizeEachWord } from "@/utils/capitalize";
import { statusColor } from "@/utils/screeningData";

interface Props {
    data: PsychologistScreeningItem[];
}

export default function ScreeningTable({
    data
}: Props) {

    return (
        <div className="h-full bg-netral-100 p-6 rounded-xl border border-netral-300">
            {/* Header */}
            <div className="w-full flex items-start justify-between gap-4 mb-6">

                <div>
                    <h3 className="text-lg font-semibold text-netral-900">
                        Tes Masuk Terbaru
                    </h3>
                </div>

                <Link
                    href={route("screening.index")}
                    className="font-medium text-primary hover:underline"
                >
                    Lihat Semua
                </Link>
            </div>

            {/* Table */}
            <div className="border border-netral-300 rounded-xl">
                <div className="w-full overflow-x-auto">

                    <Table>
                        {/* Header */}
                        <TableHeader className="border-netral-300 border-b">
                            <TableRow>

                                {/* Name */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Nama
                                </TableCell>

                                {/* Instrument Type */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Tipe Instrumen
                                </TableCell>

                                {/* Date */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Tanggal Tes
                                </TableCell>

                                {/* Status */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Body */}
                        <TableBody>

                            {data?.length === 0 ? (
                                <EmptyTable
                                    colspan={5}
                                    description="Tidak ada data tes masuk"
                                />
                            ) : (
                                data.map((screening, index) => (
                                    <TableRow
                                        key={index}
                                        className="border-netral-300 border-b"
                                    >

                                        {/* Subject */}
                                        <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                            {screening.name}
                                        </TableCell>

                                        {/* Instrument Type */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {screening.instrument} -  {capitalizeEachWord(screening.type.replaceAll("_", " "))}
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {formatCalendarDate(
                                                screening.date
                                            )}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            <Badge
                                                color={statusColor[screening.status] ?? "secondary"}
                                                size="sm"
                                            >
                                                {screening.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
