import { useDelete } from "@/hooks/useDelete";

import { ClassCardProps } from "@/types/subject";

import Button from "@/Components/ui/button/Button";
import ClassCard from "@/Components/card/ClassCard";
import EmptyState from "@/Components/empty/EmptyState";

import { LuPlus } from "react-icons/lu";

export default function ClassDetailCard({
    classes,
    onCreate,
    onEdit,
}: ClassCardProps) {

    const { handleDelete } = useDelete({
        routeName: "class.destroy",
        confirmTitle: "Hapus Kelas?",
        confirmText: "Jika Anda menghapus kelas ini, maka seluruh siswa yang ada di kelas ini, tidak akan memiliki kelas.",
        successMessage: "Kelas berhasil dihapus",
        errorMessage: "Gagal: Kelas masih memiliki siswa",
    });

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-start justify-between">

                <div>
                    <h2 className="text-lg font-semibold text-netral-900">
                        Daftar Kelas
                    </h2>

                    <p className="text-sm text-netral-600 mt-1">
                        Berikut adalah daftar kelas yang disiapkan untuk tiap siswa.
                    </p>
                </div>

                {/* Add Class */}
                <Button
                    size="lg"
                    startIcon={<LuPlus />}
                    onClick={onCreate}
                    className="text-sm w-full md:w-auto"
                >
                    Tambah Kelas
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                {classes.length > 0 ? (
                    classes.map((item) => (
                        <ClassCard
                            key={item.id}
                            class_name={item.class_name}
                            total={item.subjects_count ?? 0}
                            onDelete={() => handleDelete(item.id)}
                            onEdit={() => onEdit(item)}
                        />
                    ))
                ) : (
                    <div className="col-span-full">
                        <EmptyState title="Tidak ditemukan data kelas!" />
                    </div>
                )}
            </div>
        </div>
    );
}
