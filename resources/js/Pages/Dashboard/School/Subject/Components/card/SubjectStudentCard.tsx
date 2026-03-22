import { router } from "@inertiajs/react";
import { useDelete } from "@/hooks/useDelete";

import { SubjectCardProps } from "@/types/subject";

import FilterBar from "@/Components/filter/FilterBar";
import Button from "@/Components/ui/button/Button";
import SubjectCard from "@/Components/card/SubjectCard";
import EmptyState from "@/Components/empty/EmptyState";

import { LuPlus } from "react-icons/lu";

export default function SubjectStudentCard({
    subjects,
    classes,
    filters,
    setFilter,
    onCreate,
    onEdit,
}: SubjectCardProps) {

    const { handleDelete } = useDelete({
        routeName: "subject.destroy",
        confirmTitle: "Hapus Data Siswa?",
        confirmText: "Jika Anda menghapus data siswa ini, maka seluruh riwayat tes yang sudah dilakukan akan ikut terhapus.",
        successMessage: "Data siswa berhasil dihapus",
        errorMessage: "Gagal menghapus data siswa",
    });

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">

            {/* Header */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-4">

                <div>
                    <h2 className="text-lg font-semibold text-netral-900">
                        Daftar Siswa
                    </h2>

                    <p className="text-sm text-netral-600 mt-1">
                        Berikut adalah daftar siswa yang dapat Anda lakukan tes skrining.
                    </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col md:flex-row items-center gap-2">
                    {/* Filter Subject */}
                    <FilterBar
                        className="w-full lg:flex-1"
                        search={{
                            value: filters.search,
                            placeholder: "Cari siswa",
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

                    {/* Add Subject */}
                    <Button
                        size="lg"
                        startIcon={<LuPlus />}
                        onClick={onCreate}
                        className="text-sm w-full md:w-1/2 lg:w-auto"
                    >
                        Tambah Siswa
                    </Button>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                {subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            name={subject.name}
                            gender={subject.gender}
                            age={subject.age}
                            classLevel={subject.class?.class_name}
                            lastResult={subject.last_result ?? "-"}
                            onDelete={() => handleDelete(subject.id)}
                            onEdit={() => onEdit(subject)}
                            onClick={() => router.visit(route("subject.school.show", subject.id))}
                        />
                    ))
                ) : (
                    <div className="col-span-full">
                        <EmptyState title="Tidak ditemukan data siswa!" />
                    </div>
                )}
            </div>
        </div>
    );
}
