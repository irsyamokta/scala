import { useState } from "react";
import { router } from "@inertiajs/react";
import { LuPlus, LuTrash2 } from "react-icons/lu";

import { PaginatedSubjects, SubjectCardProps } from "@/types/subject";
import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import FilterBar from "@/shared/components/filter/FilterBar";
import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/forms/Select";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import SubjectStudentTable from "../table/SubjectStudentTable";

import { PER_PAGE_OPTIONS } from "@/shared/constants/filterOptions";

export default function SubjectStudentCard({
    subjects,
    classes,
    filters,
    setFilter,
    onCreate,
    onEdit,
}: SubjectCardProps) {
    const paginated = subjects as PaginatedSubjects;
    const subjectList = paginated?.data ?? (subjects as any);

    const [selected, setSelected] = useState<string[]>([]);

    const allIds     = subjectList.map((s: any) => s.id);
    const allChecked = allIds.length > 0 && allIds.every((id: string) => selected.includes(id));

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
            title: `Hapus ${selected.length} Siswa?`,
            text: "Seluruh riwayat tes siswa yang dipilih akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirmed) return;

        for (const id of selected) {
            await new Promise<void>((resolve) => {
                router.delete(route("subject.destroy", id), {
                    preserveState: true,
                    onFinish: () => resolve(),
                });
            });
        }

        setSelected([]);
        router.reload();
    }

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">

            {/* Header */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-netral-900">Daftar Siswa</h2>
                    <p className="text-sm text-netral-600 mt-1">
                        Berikut adalah daftar siswa yang dapat Anda lakukan tes skrining.
                    </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col md:flex-row items-center gap-2">
                    <FilterBar
                        className="w-full lg:w-2/3"
                        search={{
                            value: filters.search,
                            placeholder: "Cari nama atau NIS...",
                            onChange: (value) => setFilter("search", value),
                        }}
                        filters={[
                            {
                                label: "Kelas",
                                value: filters.class_id ?? [],
                                options: (classes ?? []).map((c) => ({
                                    value: String(c.value ?? c.id),
                                    label: c.label ?? c.class_name,
                                })),
                                onChange: (value) => setFilter("class_id", value),
                            },
                            {
                                label: "Gender",
                                value: filters.gender ?? [],
                                options: [
                                    { value: "male", label: "Laki-laki" },
                                    { value: "female", label: "Perempuan" },
                                ],
                                onChange: (value) => setFilter("gender", value),
                            },
                        ]}
                    />

                    {selected.length > 0 && (
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
                        Tambah Siswa
                    </Button>
                </div>
            </div>

            {/* Table */}
            <SubjectStudentTable
                subjects={subjectList}
                selected={selected}
                allChecked={allChecked}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEdit={onEdit}
            />

            {/* Footer: Per Page + Pagination */}
            <div className="flex justify-between items-center gap-2 mt-4">
                <Select
                    value={filters?.per_page ?? 10}
                    placeholder="10"
                    onChange={(value) => setFilter("per_page", value)}
                    className="max-w-18"
                    options={PER_PAGE_OPTIONS}
                />

                <Pagination
                    links={paginated?.links ?? []}
                    filters={filters}
                    routeName="subject.school.index"
                />
            </div>
        </div>
    );
}
