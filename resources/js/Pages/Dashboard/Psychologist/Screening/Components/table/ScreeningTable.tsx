import { ScreeningsTableProps, ScreeningResult } from "@/types/screening";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Badge from "@/Components/ui/badge/Badge";
import FilterBar from "@/Components/filter/FilterBar";
import Button from "@/Components/ui/button/Button";
import { EmptyTable } from "@/Components/empty/EmptyTable";
import Select from "@/Components/form/input/Select";
import Pagination from "@/Components/ui/pagination/Pagination";

import { RESULT_OPTIONS, PER_PAGE_OPTIONS } from "@/constants/filterOptions";
import { typeLabels, categoryColor } from "@/constants/screening";

import { formatDateTime } from "@/utils/formatDate";
import { statusColor } from "@/utils/screeningData";

import { IoEyeOutline } from "react-icons/io5";

export default function ScreeningTable({
    screenings,
    filters,
    setFilter,
    onView,
}: ScreeningsTableProps) {

    const getCategory = (screening: ScreeningResult) => {
        if (screening.sdq_result) {
            return screening.sdq_result.overall_category;
        }

        if (screening.srq_result) {
            return screening.srq_result.gme_indication
                ? "Terindikasi"
                : "Tidak Terindikasi";
        }

        return null;
    };

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 mb-6">

                <div>
                    <h2 className="text-lg font-semibold text-netral-900">
                        Daftar Hasil Tes
                    </h2>

                    <p className="text-sm text-netral-600 mt-1">
                        Berikut adalah daftar hasil tes yang sudah dikerjakan.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-2">

                    <FilterBar
                        className="flex-1"
                        search={{
                            value: filters?.search ?? "",
                            placeholder: "Cari nama anak",
                            onChange: (value) => setFilter?.("search", value)
                        }}
                        filter={{
                            label: "Kategori",
                            value: filters?.category ?? [],
                            options: RESULT_OPTIONS,
                            onChange: (value) =>
                                setFilter?.(
                                    "category",
                                    Array.isArray(value) ? value : [value]
                                )
                        }}
                    />
                </div>
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

                                {/* Instrument */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Instrumen Tes
                                </TableCell>

                                {/* Reporter */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Pelapor
                                </TableCell>

                                {/* Result */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Hasil Tes
                                </TableCell>

                                {/* Status */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Status
                                </TableCell>

                                {/* Date */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Tanggal Tes
                                </TableCell>

                                {/* Action */}
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                    Aksi
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Body */}
                        <TableBody>

                            {screenings.data.length === 0 ? (
                                <EmptyTable
                                    colspan={8}
                                    description="Tidak ada data hasil tes"
                                />
                            ) : (
                                screenings.data.map((screening) => (
                                    <TableRow
                                        key={screening.id}
                                        className="border-netral-300 border-b"
                                    >

                                        {/* Subject */}
                                        <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                            {screening.subject.name}
                                        </TableCell>

                                        {/* Instrument Type */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {screening.instrument.name} - {typeLabels[screening.instrument_type.type_name]}
                                        </TableCell>

                                        {/* Reporter */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {screening.reporter.name}
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const category = getCategory(screening);

                                                return category ? (
                                                    <Badge
                                                        color={categoryColor[category]}
                                                        size="sm"
                                                    >
                                                        {category}
                                                    </Badge>
                                                ) : (
                                                    "-"
                                                );
                                            })()}
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

                                        {/* Date */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {formatDateTime(
                                                screening.date_taken
                                            )}
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

            {/* Pagination */}
            <div className="flex justify-between items-center gap-2">
                <Select
                    value={filters?.per_page ?? 10}
                    placeholder="10"
                    onChange={(value) => setFilter?.("per_page", value)}
                    className="max-w-18 mt-6"
                    options={PER_PAGE_OPTIONS}
                />

                <Pagination
                    links={screenings.links}
                    filters={filters ?? {}}
                    routeName="screening.index"
                />
            </div>
        </div>
    );
}
