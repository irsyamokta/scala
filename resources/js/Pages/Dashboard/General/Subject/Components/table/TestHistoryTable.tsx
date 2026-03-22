import { ScreeningsTableProps } from "@/types/screening";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";
import Button from "@/Components/ui/button/Button";
import { EmptyTable } from "@/Components/empty/EmptyTable";
import { categoryColor } from "@/constants/screening";

import { formatDateTime } from "@/utils/formatDate";
import { getScreeningCategory } from "@/utils/screeningData";
import { statusColor } from "@/utils/screeningData";

import { IoEyeOutline } from "react-icons/io5";

export default function TestHistoryTable({
    screenings,
    onView,
}: ScreeningsTableProps) {

    return (
        <div>
            {/* Table */}
            <div className="border border-netral-300 rounded-xl">
                <div className="w-full overflow-x-auto">

                    <Table>
                        {/* Header */}
                        <TableHeader className="border-netral-300 border-b">
                            <TableRow>

                                {/* Instrument */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Instrumen Tes
                                </TableCell>

                                {/* Date */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Tanggal Tes
                                </TableCell>

                                {/* Kategori */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Kategori
                                </TableCell>

                                {/* Status */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Status
                                </TableCell>

                                {/* Action */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Detail Hasil Tes
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Body */}
                        <TableBody>

                            {screenings.data.length === 0 ? (
                                <EmptyTable
                                    colspan={5}
                                    description="Tidak ada riwayat hasil tes"
                                />
                            ) : (
                                screenings.data.map((screening) => (
                                    <TableRow
                                        key={screening.id}
                                        className="border-netral-300 border-b"
                                    >

                                        {/* Instrument */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {screening.instrument.name}
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {formatDateTime(
                                                screening.date_taken
                                            )}
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {getScreeningCategory(screening) ? (
                                                <Badge
                                                    color={categoryColor[getScreeningCategory(screening)!]}
                                                    size="sm"
                                                >
                                                    {getScreeningCategory(screening)}
                                                </Badge>
                                            ) : (
                                                "-"
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

                                        {/* Action */}
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                startIcon={<IoEyeOutline />}
                                                onClick={() => onView(screening)}
                                                className="cursor-pointer"
                                            >
                                                Lihat Detail
                                            </Button>
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
