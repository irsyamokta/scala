import { useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { LuUserCheck, LuLock, LuDownload, LuLink, LuQrCode, LuPencil } from "react-icons/lu";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from "sonner";

import DashboardLayout from "@/Layouts/DashboardLayout";
import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import Select from "@/shared/components/forms/Select";
import Form from "@/shared/components/forms/Form";
import { Modal } from "@/shared/components/ui/modal";
import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import ScreeningDetailModal from "../Subject/Components/modal/ScreeningModal";
import BatchModal from "./Components/modal/BatchModal";
import ParticipantTable from "./Components/table/ParticipantTable";
import ParticipantRecapTable from "../Batch/Components/table/ParticipantRecapTable";
import { BatchShowPageProps } from "@/types/batch";
import { ScreeningResult } from "@/types/screening";

import Decorative from "@assets/svg/bg-decoration-2.svg";

type TabType = "participants" | "recap";

export default function BatchShow() {
    const { batch, participants, classes = [], instruments = [], psychologists = [], screening_url, qr_code_svg, back_route, auth } =
        usePage<BatchShowPageProps>().props;

    const isSuperadmin = auth.user.role === "superadmin";

    const [tab, setTab]           = useState<TabType>("participants");
    const [assignOpen, setAssignOpen] = useState(false);
    const [qrOpen, setQrOpen]     = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);

    function handleViewScreening(screening: ScreeningResult) {
        setSelectedScreening(screening);
        setDetailOpen(true);
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        psychologist_id: batch.assigned_psychologist_id ?? "",
    });

    const isClosed  = batch.status === "closed";
    const isExpired = batch.expires_at ? new Date(batch.expires_at) < new Date() : false;

    const testedCount = participants.filter((s) => s.batch_entries.length > 0).length;
    const doneCount   = participants.filter((s) =>
        s.batch_entries[0]?.screening?.status === "Selesai Dievaluasi"
    ).length;
    const totalCount  = participants.length;

    const statusColor: "success" | "error" | "dark" =
        isClosed ? "dark" : isExpired ? "error" : "success";
    const statusLabel = isClosed ? "Ditutup" : isExpired ? "Kedaluwarsa" : "Aktif";

    async function handleClose() {
        const confirmed = await ConfirmationDialog({
            title: "Tutup Batch Ini?",
            text: "Siswa tidak bisa lagi mengakses link tes setelah batch ditutup.",
            confirmButtonText: "Ya, Tutup",
            cancelButtonText: "Batal",
        });
        if (!confirmed) return;
        router.patch(route("batch.close", batch.id));
    }

    function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        post(route("batch.assign", batch.id), {
            onSuccess: () => { setAssignOpen(false); reset(); },
        });
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(screening_url);
        toast.success("Link tes berhasil disalin.");
    }

    return (
        <DashboardLayout title={batch.label}>
            <Head title={batch.label} />

            <ScreeningDetailModal
                isOpen={detailOpen}
                onClose={() => { setDetailOpen(false); setSelectedScreening(null); }}
                screening={selectedScreening}
            />

            {/* Modal Edit Batch */}
            {classes.length > 0 && instruments.length > 0 && (
                <BatchModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    classes={classes}
                    instruments={instruments}
                    batch={{
                        ...batch,
                        tested_count: testedCount,
                    }}
                />
            )}

            {/* Modal Assign Psikolog */}
            <Modal
                isOpen={assignOpen}
                onClose={() => setAssignOpen(false)}
                title={batch.assigned_psychologist ? "Ganti Psikolog" : "Tugaskan Psikolog"}
                subtitle="Pilih psikolog yang akan menganalisis hasil tes batch ini."
                formId="assign-form"
                submitLabel={processing ? "Menyimpan..." : "Simpan"}
                cancelLabel="Batal"
                loading={processing}
                position="right"
                className="max-w-110"
            >
                <Form id="assign-form" onSubmit={handleAssign} className="p-4 space-y-4">
                    <Select
                        label="Psikolog"
                        required
                        placeholder="-- Pilih Psikolog --"
                        options={psychologists.map((p) => ({ value: p.id, label: p.name }))}
                        value={data.psychologist_id}
                        onChange={(val) => setData("psychologist_id", String(val))}
                        error={errors.psychologist_id}
                    />
                </Form>
            </Modal>

            {/* Modal QR Code */}
            <Modal
                isOpen={qrOpen}
                onClose={() => setQrOpen(false)}
                title="QR Code Tes"
                subtitle="Tampilkan QR code ini agar siswa bisa scan dan langsung mengakses tes."
                position="center"
                className="max-w-sm"
            >
                <div className="flex flex-col items-center gap-4 p-6">
                    <div
                        className="w-48 h-48"
                        dangerouslySetInnerHTML={{ __html: qr_code_svg }}
                    />
                    <p className="text-xs text-gray-500 text-center break-all">{screening_url}</p>
                    <Button
                        variant="outline"
                        startIcon={<LuLink size={14} />}
                        onClick={handleCopyLink}
                        className="w-full"
                    >
                        Salin Link
                    </Button>
                </div>
            </Modal>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="relative bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                            <img src={Decorative} alt="" className="absolute -top-12 -right-26 rotate-1 hidden sm:block pointer-events-none" />
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={back_route}>
                                <Button size="icon" variant="outline">
                                    <IoIosArrowRoundBack size={24} />
                                </Button>
                            </Link>
                            <h2 className="text-lg font-semibold text-netral-900 truncate flex-1">
                                {batch.label}
                            </h2>
                            <Badge color={statusColor} size="sm">{statusLabel}</Badge>

                            {/* Edit Button beside badge */}
                            {classes.length > 0 && instruments.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(true)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-netral-500 hover:bg-netral-200 hover:text-netral-900 transition"
                                    title="Edit batch"
                                >
                                    <LuPencil size={15} />
                                </button>
                            )}

                            {isSuperadmin && (
                                <Button
                                    startIcon={<LuUserCheck size={14} />}
                                    onClick={() => setAssignOpen(true)}
                                    size="sm"
                                >
                                    {batch.assigned_psychologist ? "Ganti Psikolog" : "Tugaskan Psikolog"}
                                </Button>
                            )}
                        </div>

                        {/* Info batch */}
                        <div className="grid grid-cols-[140px_1fr] gap-y-3 mt-6 max-w-md">
                            <p className="text-sm text-netral-600">Kelas</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {batch.class?.class_name ?? <span className="italic text-netral-500">Semua Kelas</span>}
                            </p>

                            <p className="text-sm text-netral-600">Instrumen</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {batch.instrument?.name ?? "-"}
                            </p>

                            {batch.expires_at && (
                                <>
                                    <p className="text-sm text-netral-600">Kedaluwarsa</p>
                                    <p className={`text-sm font-semibold ${isExpired ? "text-red-600" : "text-netral-900"}`}>
                                        {new Date(batch.expires_at).toLocaleString("id-ID")}
                                    </p>
                                </>
                            )}

                            <p className="text-sm text-netral-600">Progress Tes</p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 rounded-full bg-netral-200">
                                    <div
                                        className="h-2 rounded-full bg-primary transition-all"
                                        style={{ width: `${totalCount > 0 ? Math.round((testedCount / totalCount) * 100) : 0}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-netral-900 shrink-0">
                                    {testedCount}/{totalCount}
                                </span>
                            </div>

                            <p className="text-sm text-netral-600">Psikolog</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {batch.assigned_psychologist?.name ?? (
                                    <span className="italic text-netral-500">Belum ditugaskan</span>
                                )}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {!isClosed && (
                                <>
                                    <Button
                                        startIcon={<LuQrCode size={14} />}
                                        onClick={() => setQrOpen(true)}
                                        size="sm"
                                    >
                                        QR Code &amp; Link
                                    </Button>
                                    <Button
                                        variant="outline"
                                        startIcon={<LuLock size={14} />}
                                        onClick={handleClose}
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        Tutup Batch
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outline"
                                startIcon={<LuDownload size={14} />}
                                onClick={() => window.location.href = route("batch.export", batch.id)}
                            >
                                Export Peserta
                            </Button>
                            <Button
                                variant="outline"
                                startIcon={<LuDownload size={14} />}
                                onClick={() => window.location.href = route("batch.export-recap", batch.id)}
                            >
                                Export Rekap
                            </Button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 mt-6 border-b border-netral-200">
                            {(["participants", "recap"] as TabType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                                        tab === t
                                            ? "border-primary text-primary"
                                            : "border-transparent text-netral-500 hover:text-netral-700"
                                    }`}
                                >
                                    {t === "participants"
                                        ? `Peserta (${totalCount})`
                                        : "Rekap Hasil"}
                                </button>
                            ))}
                        </div>

                        {tab === "participants" && (
                            <div className="mt-4">
                                <ParticipantTable participants={participants} />
                            </div>
                        )}

                        {tab === "recap" && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { label: "Total Siswa",        value: totalCount,              color: "bg-blue-50   text-blue-600" },
                                        { label: "Sudah Tes",          value: testedCount,             color: "bg-yellow-50 text-yellow-600" },
                                        { label: "Menunggu Analisis",  value: testedCount - doneCount, color: "bg-orange-50 text-orange-600" },
                                        { label: "Selesai Dianalisis", value: doneCount,               color: "bg-green-50  text-green-600" },
                                    ].map((s) => (
                                        <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                                            <p className="text-2xl font-bold">{s.value}</p>
                                            <p className="text-xs mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-xl border border-netral-200 bg-white p-4">
                                    <div className="mb-1 flex justify-between text-xs text-netral-500">
                                        <span>Progress analisis</span>
                                        <span>{testedCount > 0 ? Math.round((doneCount / testedCount) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-netral-200">
                                        <div
                                            className="h-2.5 rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${testedCount > 0 ? Math.round((doneCount / testedCount) * 100) : 0}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs text-netral-400">
                                        <span>{doneCount} dianalisis</span>
                                        <span>{testedCount} tes selesai dari {totalCount} siswa</span>
                                    </div>
                                </div>

                                <ParticipantRecapTable
                                    participants={participants}
                                    onView={handleViewScreening}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
