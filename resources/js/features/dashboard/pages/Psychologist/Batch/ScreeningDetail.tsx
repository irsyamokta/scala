import { useForm, Head, usePage } from "@inertiajs/react";
import {
    LuArrowLeft,
    LuSave,
    LuCircleCheck,
    LuClock,
} from "react-icons/lu";

import DashboardLayout from "@/Layouts/DashboardLayout";
import TextArea from "@/shared/components/forms/TextArea";
import InputField from "@/shared/components/forms/InputField";
import Badge from "@/shared/components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import SectionTitle from "@/shared/components/ui/SectionTitle";

import { typeLabels, categoryColor, SDQ_RANGES } from "@/shared/constants/screening";
import { getScreeningDetailRows, getScreeningCategory, getSdqRanges } from "@/shared/utils/screeningData";
import { formatDateTime } from "@/shared/utils/formatDate";

import { ScreeningResult, ScreeningNoteForm } from "@/types/screening";
import { PageProps } from "@/types";

interface BatchScreeningDetailPageProps extends PageProps {
    batch: { id: string; label: string };
    screening: ScreeningResult;
}

export default function BatchScreeningDetail() {
    const { batch, screening } = usePage<BatchScreeningDetailPageProps>().props;

    const isSDQ    = !!screening.sdq_result;
    const editId   = isSDQ ? screening.sdq_result?.id : screening.srq_result?.id;
    const updateRoute = isSDQ ? "sdq-result.update" : "srq-result.update";
    const isDone   = screening.status === "Selesai Dievaluasi";

    const { data, setData, patch, processing, errors } = useForm<ScreeningNoteForm>({
        emotional_note:         screening.sdq_result?.emotional_note        ?? "",
        conduct_note:           screening.sdq_result?.conduct_note          ?? "",
        hyperactivity_note:     screening.sdq_result?.hyperactivity_note    ?? "",
        peer_note:              screening.sdq_result?.peer_note             ?? "",
        prosocial_note:         screening.sdq_result?.prosocial_note        ?? "",
        gme_note:               screening.srq_result?.gme_note              ?? "",
        substance_use_note:     screening.srq_result?.substance_use_note    ?? "",
        psychotic_symptom_note: screening.srq_result?.psychotic_symptom_note ?? "",
        ptsd_symptom_note:      screening.srq_result?.ptsd_symptom_note     ?? "",
        psychologist_note:      screening.srq_result?.psychologist_note     ?? "",
        recommendation:
            screening.sdq_result?.recommendation ??
            screening.srq_result?.recommendation ?? "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(route(updateRoute, editId), {
            preserveScroll: true,
        });
    }

    const rows     = getScreeningDetailRows(screening);
    const category = getScreeningCategory(screening);
    const sdqRanges = getSdqRanges(screening.instrument_type?.type_name ?? "");

    const psychologist =
        screening.sdq_result?.psychologist ??
        screening.srq_result?.psychologist;

    const analysisDate =
        screening.sdq_result?.date_analysis ??
        screening.srq_result?.date_analysis;

    return (
        <DashboardLayout title="Analisis Screening">
            <Head title="Analisis Screening" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-4 md:gap-6">

                    {/* Breadcrumb */}
                    <div className="col-span-12 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <a
                                href={route("pin-batch.show", batch.id)}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-primary"
                            >
                                <LuArrowLeft size={15} />
                                {batch.label}
                            </a>
                            <span className="text-gray-300">/</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {screening.subject?.name ?? "Screening"}
                            </span>
                        </div>

                        {/* Status badge */}
                        {isDone ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                <LuCircleCheck size={12} />
                                Selesai Dievaluasi
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                                <LuClock size={12} />
                                Menunggu Evaluasi
                            </span>
                        )}
                    </div>

                    {/* Left col: info panels */}
                    <div className="col-span-12 lg:col-span-4 space-y-4">

                        {/* Informasi Umum */}
                        <InfoCard title="Informasi Umum">
                            <InfoRow label="Nama Siswa" value={screening.subject?.name ?? "-"} />
                            <InfoRow label="Instrumen" value={screening.instrument?.name ?? "-"} />
                            <InfoRow
                                label="Tipe"
                                value={typeLabels[screening.instrument_type?.type_name ?? ""] ?? "-"}
                            />
                            <InfoRow
                                label="Tanggal Tes"
                                value={formatDateTime(screening.date_taken)}
                            />
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">Kategori</p>
                                {category ? (
                                    <Badge color={categoryColor[category]} size="sm">
                                        {category}
                                    </Badge>
                                ) : (
                                    <span className="text-sm text-gray-400">-</span>
                                )}
                            </div>
                        </InfoCard>

                        {/* Informasi Psikolog */}
                        <InfoCard title="Informasi Psikolog">
                            <InfoRow label="Nama" value={psychologist?.name ?? "-"} />
                            <InfoRow
                                label="Tanggal Analisis"
                                value={analysisDate ? formatDateTime(analysisDate) : "-"}
                            />
                        </InfoCard>

                        {/* Rentang Nilai */}
                        <InfoCard title="Rentang Nilai">
                            {isSDQ ? (
                                sdqRanges.map((r) => (
                                    <InfoRow key={r.label} label={r.label} value={r.range} />
                                ))
                            ) : (
                                <>
                                    <InfoRow label="GME" value="≥5 YA dari pertanyaan 1-20" />
                                    <InfoRow label="Penggunaan Zat" value="YA pada pertanyaan 21" />
                                    <InfoRow label="Gejala Psikotik" value="YA pada pertanyaan 22-24" />
                                    <InfoRow label="Gejala PTSD" value="YA pada pertanyaan 25-29" />
                                </>
                            )}
                        </InfoCard>
                    </div>

                    {/* Right col: analisis form */}
                    <div className="col-span-12 lg:col-span-8 space-y-4">

                        {/* Detail Aspek */}
                        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                            <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-700">
                                <SectionTitle title="Detail Aspek & Catatan" />
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-gray-700">
                                        <TableRow>
                                            <TableCell isHeader className="px-4 py-3 text-sm font-semibold">Aspek</TableCell>
                                            <TableCell isHeader className="px-4 py-3 text-sm font-semibold">Rentang</TableCell>
                                            <TableCell isHeader className="px-4 py-3 text-sm font-semibold">Hasil</TableCell>
                                            <TableCell isHeader className="px-4 py-3 text-sm font-semibold">Catatan Psikolog</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((row, i) => (
                                            <TableRow key={i} className="border-b border-gray-100 dark:border-gray-700">
                                                <TableCell className="px-4 py-3 text-sm font-medium">{row.aspect}</TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-gray-500">{row.range}</TableCell>
                                                <TableCell className="px-4 py-3 text-sm font-semibold">{row.result}</TableCell>
                                                <TableCell className="px-4 py-3 min-w-[200px]">
                                                    {row.noteField && (
                                                        <InputField
                                                            value={data[row.noteField] ?? ""}
                                                            placeholder="Catatan..."
                                                            onChange={(e) =>
                                                                setData(row.noteField!, e.target.value)
                                                            }
                                                            error={errors[row.noteField]}
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Rekomendasi */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-3">
                                <SectionTitle title="Rekomendasi Psikolog" />
                            </div>
                            <TextArea
                                value={data.recommendation ?? ""}
                                placeholder="Tuliskan rekomendasi untuk siswa ini..."
                                onChange={(value) => setData("recommendation", value)}
                                error={errors.recommendation}
                            />
                        </div>

                        {/* Save */}
                        <div className="flex justify-end gap-3">
                            <a
                                href={route("pin-batch.show", batch.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                            >
                                Batal
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                            >
                                <LuSave size={16} />
                                {processing ? "Menyimpan..." : "Simpan Analisis"}
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

function InfoCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 space-y-3">
            <SectionTitle title={title} />
            <div className="space-y-2.5 pt-1">{children}</div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-2">
            <p className="shrink-0 text-sm text-gray-500">{label}</p>
            <p className="text-right text-sm font-medium text-gray-800 dark:text-white">{value}</p>
        </div>
    );
}
