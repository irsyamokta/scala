import { useMemo } from "react";

import { useModalForm } from "@/shared/hooks/useModalForm";

import {
    ScreeningDetailModalProps,
    ScreeningNoteForm
} from "@/types/screening";

import { Modal } from "@/shared/components/ui/modal";
import Button from "@/shared/components/ui/button/Button";
import TextArea from "@/shared/components/forms/TextArea";
import Form from "@/shared/components/forms/Form";
import Badge from "@/shared/components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import SectionTitle from "@/shared/components/ui/SectionTitle";
import Input from "@/shared/components/forms/InputField";

import { typeLabels, categoryColor } from "@/shared/constants/screening";

import {
    getScreeningDetailRows,
    getScreeningCategory,
    getSdqRanges
} from "@/shared/utils/screeningData";
import { formatDateTime } from "@/shared/utils/formatDate";

import { LuSave } from "react-icons/lu";

export default function ScreeningDetailModal({
    isOpen,
    onClose,
    screening,
}: ScreeningDetailModalProps) {
    const safeScreening = screening ?? ({} as any);

    const isSDQ = !!safeScreening?.sdq_result;

    const updateRoute = isSDQ
        ? "sdq-result.update"
        : "srq-result.update";

    const editId = isSDQ
        ? safeScreening?.sdq_result?.id
        : safeScreening?.srq_result?.id;

    const initialValues = useMemo<ScreeningNoteForm>(() => ({
        emotional_note: screening?.sdq_result?.emotional_note ?? "",
        conduct_note: screening?.sdq_result?.conduct_note ?? "",
        hyperactivity_note: screening?.sdq_result?.hyperactivity_note ?? "",
        peer_note: screening?.sdq_result?.peer_note ?? "",
        prosocial_note: screening?.sdq_result?.prosocial_note ?? "",

        gme_note: screening?.srq_result?.gme_note ?? "",
        substance_use_note: screening?.srq_result?.substance_use_note ?? "",
        psychotic_symptom_note: screening?.srq_result?.psychotic_symptom_note ?? "",
        ptsd_symptom_note: screening?.srq_result?.ptsd_symptom_note ?? "",
        psychologist_note: screening?.srq_result?.psychologist_note ?? "",

        recommendation:
            screening?.sdq_result?.recommendation ??
            screening?.srq_result?.recommendation ??
            "",
    }), [screening]);

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<ScreeningNoteForm>({
        isOpen,
        onClose,
        initialValues,
        editData: initialValues,
        editId: editId,
        createMessage: "Hasil tes berhasil disimpan",
        storeRoute: updateRoute,
        updateRoute: updateRoute,
    });

    if (!screening) return null;

    const rows = getScreeningDetailRows(screening);
    const category = getScreeningCategory(screening);
    const sdqRanges = getSdqRanges(screening.instrument_type?.type_name ?? "");

    const psychologist =
        screening.sdq_result?.psychologist ??
        screening.srq_result?.psychologist;

    const analysisDate =
        screening.sdq_result?.date_analysis ??
        screening.srq_result?.date_analysis;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Hasil Tes"
            position="center"
            className="max-w-8xl"
        >

            <Form id="form-notes" onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                    {/* Top Information */}
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-12">
                        {/* Basic Info */}
                        <div>
                            <SectionTitle title="Informasi Umum" />

                            <div className="grid gap-4 text-sm mt-4">

                                <div className="flex justify-between">
                                    <p className="text-netral-600">Nama</p>
                                    <p className="font-medium">
                                        {screening.subject?.name ?? "-"}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-netral-600">Instrumen</p>
                                    <p className="font-medium">
                                        {screening.instrument?.name ?? "-"}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-netral-600">Tipe Instrumen</p>
                                    <p className="font-medium">
                                        {typeLabels[screening.instrument_type?.type_name ?? ""] ?? "-"}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-netral-600">Tanggal Tes</p>
                                    <p className="font-medium">
                                        {formatDateTime(screening.date_taken)}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-netral-600">Hasil Tes</p>

                                    {category ? (
                                        <Badge color={categoryColor[category]}>
                                            {category}
                                        </Badge>
                                    ) : "-"}
                                </div>
                            </div>
                        </div>


                        {/* Psychologist */}
                        <div>
                            <SectionTitle title="Informasi Psikolog" />

                            <div className="grid gap-4 text-sm mt-4">

                                <div className="flex justify-between">
                                    <p className="text-netral-600">Nama</p>
                                    <p className="font-medium">
                                        {psychologist?.name ?? "-"}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-netral-600">
                                        Tanggal Analisis
                                    </p>
                                    <p className="font-medium">
                                        {analysisDate
                                            ? formatDateTime(analysisDate)
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* Range Information */}
                        <div>
                            <SectionTitle title="Detail Rentang Nilai" />

                            <div className="grid gap-4 text-sm mt-4">

                                {screening.sdq_result && (
                                    <div className="grid gap-4 lg:w-2/3">
                                        {sdqRanges.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex justify-between"
                                            >
                                                <p className="text-netral-600">
                                                    {item.label}
                                                </p>
                                                <p className="font-medium">
                                                    {item.range}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {screening.srq_result && (
                                    <>
                                        <div className="flex justify-between">
                                            <p className="text-netral-600">
                                                Gangguan Mental Emosional
                                            </p>
                                            <p className="font-medium">
                                                ≥5 YA dari pertanyaan 1-20
                                            </p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-netral-600">
                                                Penggunaan Zat
                                            </p>
                                            <p className="font-medium">
                                                YA pada pertanyaan 21
                                            </p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-netral-600">
                                                Gejala Psikotik
                                            </p>
                                            <p className="font-medium">
                                                YA pada pertanyaan 22-24
                                            </p>
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-netral-600">
                                                Gejala PTSD
                                            </p>
                                            <p className="font-medium">
                                                YA pada pertanyaan 25-29
                                            </p>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>

                    </div>


                    {/* Result Table */}
                    <div className="border border-netral-300 rounded-xl">
                        <div className="w-full overflow-x-auto">
                            <Table>

                                <TableHeader className="border-netral-300 border-b">
                                    <TableRow>

                                        <TableCell isHeader className="px-6 py-3 text-sm font-semibold whitespace-nowrap">
                                            Detail Aspek
                                        </TableCell>

                                        <TableCell isHeader className="px-6 py-3 text-sm font-semibold whitespace-nowrap">
                                            Rentang Nilai
                                        </TableCell>

                                        <TableCell isHeader className="px-6 py-3 text-sm font-semibold whitespace-nowrap">
                                            Hasil
                                        </TableCell>

                                        <TableCell isHeader className="px-6 py-3 text-sm font-semibold whitespace-nowrap">
                                            Catatan Psikolog
                                        </TableCell>

                                    </TableRow>
                                </TableHeader>

                                <TableBody>

                                    {rows.map((row, index) => (

                                        <TableRow
                                            key={index}
                                            className="border-netral-300 border-b"
                                        >

                                            <TableCell className="px-6 py-4 text-sm font-medium">
                                                {row.aspect}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-sm">
                                                {row.range}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-sm">
                                                {row.result}
                                            </TableCell>

                                            <TableCell className="px-6 py-4">

                                                {row.noteField && (
                                                    <Input
                                                        value={data[row.noteField] ?? ""}
                                                        placeholder="Masukkan catatan"
                                                        onChange={(e) =>
                                                            setData(row.noteField!, e.target.value)
                                                        }
                                                        error={serverErrors[row.noteField]}
                                                    />
                                                )}

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div>
                        <SectionTitle title="Rekomendasi Psikolog" />

                        <TextArea
                            value={data.recommendation}
                            className="mt-4"
                            placeholder="Apa rekomendasi Anda..."
                            onChange={(value) =>
                                setData("recommendation", value)
                            }
                            error={serverErrors.recommendation}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            form="form-notes"
                            size="lg"
                            startIcon={<LuSave size={18} />}
                            disabled={loading}
                        >
                            Simpan
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
