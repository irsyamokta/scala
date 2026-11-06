import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { IoIosArrowRoundBack } from "react-icons/io";

import DashboardLayout from "@/Layouts/DashboardLayout";
import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import ScreeningDetailModal from "../Screening/Components/modal/ScreeningModal";
import ParticipantTable from "../../School/Batch/Components/table/ParticipantTable";
import ParticipantRecapTable from "../../School/Batch/Components/table/ParticipantRecapTable";
import { capitalized } from "@/shared/utils/capitalize";
import { BatchShowPageProps } from "@/types/batch";
import { ScreeningResult } from "@/types/screening";

import Decorative from "@assets/svg/bg-decoration-2.svg";

type TabType = "participants" | "recap";

export default function PsychologistBatchShow() {
    const { batch, participants, back_route } = usePage<BatchShowPageProps>().props;

    const [tab, setTab] = useState<TabType>("participants");
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedScreening, setSelectedScreening] = useState<ScreeningResult | null>(null);

    function handleViewScreening(screening: ScreeningResult) {
        setSelectedScreening(screening);
        setDetailOpen(true);
    }

    const isClosed  = batch.status === "closed";
    const isExpired = batch.expires_at ? new Date(batch.expires_at) < new Date() : false;

    const testedCount = participants.filter((s) => s.batch_entries.length > 0).length;
    const doneCount   = participants.filter(
        (s) => s.batch_entries[0]?.screening?.status === "Selesai Dievaluasi"
    ).length;
    const totalCount  = participants.length;

    const statusColor: "success" | "error" | "dark" =
        isClosed ? "dark" : isExpired ? "error" : "success";
    const statusLabel = isClosed ? "Ditutup" : isExpired ? "Kedaluwarsa" : "Aktif";

    return (
        <DashboardLayout title="Detail Batch">
            <Head title="Detail Batch" />

            <ScreeningDetailModal
                isOpen={detailOpen}
                onClose={() => { setDetailOpen(false); setSelectedScreening(null); }}
                screening={selectedScreening}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <div className="relative bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                            <img src={Decorative} alt="" className="absolute -top-12 -right-26 rotate-1 hidden sm:block pointer-events-none" />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <Link href={back_route}>
                                <Button size="icon" variant="outline">
                                    <IoIosArrowRoundBack size={24} />
                                </Button>
                            </Link>
                            <Badge color={statusColor} size="sm">{statusLabel}</Badge>
                        </div>

                        <div className="grid grid-cols-[140px_1fr] gap-y-3 mt-6 max-w-md">
                            <p className="text-sm text-netral-600">Label Batch</p>
                            <p className="text-sm font-semibold text-netral-900">{batch.label}</p>

                            <p className="text-sm text-netral-600">Kelas</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {batch.class?.class_name ?? <span className="italic text-netral-500">Semua Kelas</span>}
                            </p>

                            <p className="text-sm text-netral-600">Instrumen</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {batch.instrument?.name ?? "-"}
                            </p>

                            <p className="text-sm text-netral-600">Dari Guru BK</p>
                            <p className="text-sm font-semibold text-netral-900">
                                {capitalized(batch.school?.school_name ?? '-') ?? batch.school?.name ?? "-"}
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
                        </div>

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
