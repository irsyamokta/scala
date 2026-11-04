import { ScreeningDetailModalProps } from "@/types/screening";

import { Modal } from "@/shared/components/ui/modal";
import Badge from "@/shared/components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import SectionTitle from "@/shared/components/ui/SectionTitle";
import TextArea from "@/shared/components/forms/TextArea";

import { typeLabels, categoryColor, SDQ_RANGES } from "@/shared/constants/screening";
import { getScreeningDetailRows, getScreeningCategory } from "@/shared/utils/screeningData";
import { formatDateTime } from "@/shared/utils/formatDate";

export default function ScreeningDetailModal({
    isOpen,
    onClose,
    screening,
}: ScreeningDetailModalProps) {

    if (!screening) return null;

    const rows = getScreeningDetailRows(screening);
    const category = getScreeningCategory(screening);

    const psychologist =
        screening.sdq_result?.psychologist ??
        screening.srq_result?.psychologist;

    const analysisDate =
        screening.sdq_result?.date_analysis ??
        screening.srq_result?.date_analysis;

    const recommendation =
        screening.sdq_result?.recommendation ??
        screening.srq_result?.recommendation ??
        "-";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Hasil Tes"
            position="center"
            className="max-w-8xl"
        >
            <div className="p-6 space-y-6">

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-12">
                    <div>
                        <SectionTitle title="Informasi Umum" />

                        <div className="grid gap-4 text-sm mt-4">
                            <div className="flex justify-between">
                                <p className="text-netral-600">Nama</p>
                                <p className="font-medium">{screening.subject?.name ?? "-"}</p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-netral-600">Instrumen</p>
                                <p className="font-medium">{screening.instrument?.name ?? "-"}</p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-netral-600">Tipe Instrumen</p>
                                <p className="font-medium">
                                    {typeLabels[screening.instrument_type?.type_name ?? ""] ?? "-"}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-netral-600">Tanggal Tes</p>
                                <p className="font-medium">{formatDateTime(screening.date_taken)}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-netral-600">Hasil Tes</p>
                                {category ? (
                                    <Badge color={categoryColor[category]}>{category}</Badge>
                                ) : "-"}
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionTitle title="Informasi Psikolog" />

                        <div className="grid gap-4 text-sm mt-4">
                            <div className="flex justify-between">
                                <p className="text-netral-600">Nama</p>
                                <p className="font-medium">{psychologist?.name ?? "-"}</p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-netral-600">Tanggal Analisis</p>
                                <p className="font-medium">
                                    {analysisDate ? formatDateTime(analysisDate) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionTitle title="Detail Rentang Nilai" />

                        <div className="grid gap-4 text-sm mt-4">
                            {screening.sdq_result && (
                                <div className="grid gap-4 lg:w-2/3">
                                    {(SDQ_RANGES[screening.instrument_type?.type_name as keyof typeof SDQ_RANGES] ?? []).map((item) => (
                                        <div key={item.label} className="flex justify-between">
                                            <p className="text-netral-600">{item.label}</p>
                                            <p className="font-medium">{item.range}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {screening.srq_result && (
                                <>
                                    <div className="flex justify-between">
                                        <p className="text-netral-600">Gangguan Mental Emosional</p>
                                        <p className="font-medium">≥5 YA dari pertanyaan 1-20</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-netral-600">Penggunaan Zat</p>
                                        <p className="font-medium">YA pada pertanyaan 21</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-netral-600">Gejala Psikotik</p>
                                        <p className="font-medium">YA pada pertanyaan 22-24</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-netral-600">Gejala PTSD</p>
                                        <p className="font-medium">YA pada pertanyaan 25-29</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border border-netral-300 rounded-xl">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-netral-300 border-b">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                        Detail Aspek
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900 whitespace-nowrap">
                                        Hasil
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-start text-netral-900">
                                        Interpretasi
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index} className="border-netral-300 border-b">
                                        <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                            {row.aspect}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {row.result}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-netral-600">
                                            {row.interpretation}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div>
                    <SectionTitle title="Rekomendasi Psikolog" />
                    <TextArea value={recommendation} className="mt-4" disabled />
                </div>

            </div>
        </Modal>
    );
}
