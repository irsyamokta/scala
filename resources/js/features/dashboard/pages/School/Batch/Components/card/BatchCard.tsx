import { useState } from "react";
import { router } from "@inertiajs/react";
import { LuPlus, LuKeyRound, LuTrash2 } from "react-icons/lu";

import Button from "@/shared/components/ui/button/Button";
import BatchTable from "../table/BatchTable";
import { Batch, PaginatedResponse } from "@/types/batch";
import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";

interface BatchCardProps {
    batches: PaginatedResponse<Batch>;
    onCreate: () => void;
}

export default function BatchCard({ batches, onCreate }: BatchCardProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const allIds   = batches.data.map((b) => b.id);
    const allChecked = allIds.length > 0 && allIds.every((id) => selected.includes(id));
    const someChecked = selected.length > 0;

    function toggleAll() {
        setSelected(allChecked ? [] : allIds);
    }

    function toggleOne(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    async function handleDeleteSelected() {
        const confirmed = await ConfirmationDialog({
            title: `Hapus ${selected.length} Batch?`,
            text: "Seluruh data terkait batch akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirmed) return;

        router.delete(route("batch.destroy-bulk"), {
            data: { ids: selected },
            onSuccess: () => setSelected([]),
        });
    }

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">

            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-netral-900">Batch Skrining</h2>
                    <p className="text-sm text-netral-600 mt-1">
                        Kelola batch tes skrining siswa per kelas. Siswa mengakses tes via link unik dan QR code.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {someChecked && (
                        <Button
                            variant="outline"
                            size="lg"
                            startIcon={<LuTrash2 size={15} />}
                            onClick={handleDeleteSelected}
                            className="border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap shrink-0"
                        >
                            Hapus ({selected.length})
                        </Button>
                    )}
                    <Button
                        size="lg"
                        startIcon={<LuPlus />}
                        onClick={onCreate}
                        className="text-sm w-full md:w-auto whitespace-nowrap shrink-0"
                    >
                        Buat Batch
                    </Button>
                </div>
            </div>

            {/* Content */}
            {batches.data.length === 0 ? (
                <BatchEmptyState onCreateClick={onCreate} />
            ) : (
                <BatchTable
                    batches={batches}
                    selected={selected}
                    allChecked={allChecked}
                    onToggleAll={toggleAll}
                    onToggleOne={toggleOne}
                />
            )}
        </div>
    );
}

function BatchEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
    const steps = [
        {
            number: "1",
            title: "Import Siswa",
            desc: "Upload data siswa via Excel agar tersedia di sistem.",
            href: route("subject.school.index"),
            linkLabel: "Ke halaman profil siswa →",
        },
        {
            number: "2",
            title: "Buat Batch Skrining",
            desc: "Pilih kelas dan instrumen. Link unik dan QR code di-generate otomatis.",
            action: onCreateClick,
            linkLabel: "Buat batch sekarang →",
        },
        {
            number: "3",
            title: "Bagikan Link / QR",
            desc: "Tampilkan QR code atau bagikan link tes kepada siswa.",
        },
        {
            number: "4",
            title: "Assign ke Psikolog",
            desc: "Setelah siswa selesai tes, assign ke psikolog.",
        },
    ];

    return (
        <div className="rounded-2xl border border-dashed border-netral-300 p-6 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <LuKeyRound size={32} />
                </div>
                <h3 className="text-base font-semibold text-netral-800">Belum ada Batch Skrining</h3>
                <p className="mt-1.5 text-sm text-netral-500 max-w-sm">
                    Batch Skrining adalah cara mudah mengatur tes skrining massal.
                    Ikuti langkah-langkah berikut untuk memulai.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step) => (
                    <div key={step.number} className="rounded-xl border border-netral-200 bg-white p-4 space-y-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                            {step.number}
                        </div>
                        <p className="text-sm font-semibold text-netral-800">{step.title}</p>
                        <p className="text-xs text-netral-500 leading-relaxed">{step.desc}</p>
                        {step.href && (
                            <a href={step.href} className="inline-block text-xs font-medium text-primary hover:underline">
                                {step.linkLabel}
                            </a>
                        )}
                        {step.action && (
                            <button onClick={step.action} className="inline-block text-xs font-medium text-primary hover:underline">
                                {step.linkLabel}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
