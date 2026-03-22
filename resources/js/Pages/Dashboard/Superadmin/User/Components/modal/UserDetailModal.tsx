import { Modal } from "@/Components/ui/modal";
import { UserDetailModalProps } from "@/types/user";

import SectionTitle from "@/Components/SectionTitle";

import { capitalizeEachWord } from "@/utils/capitalize";

export default function UserDetailModal({
    isOpen,
    onClose,
    user,
}: UserDetailModalProps) {

    console.log(user)

    const genderMap: Record<string, string> = {
        male: "Laki-laki",
        female: "Perempuan",
    };

    const isSchool = user?.role === "school";
    const isParent = user?.role === "parent";

    const children = isParent
        ? user?.subjects?.filter((s) => !s.is_self) ?? []
        : [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Pengguna"
            position="center"
            className="max-w-3xl"
        >
            <div className="p-6 space-y-6">

                {/* Top Information */}
                <div className="grid gap-6">

                    {/* Basic Information */}
                    <div>
                        <SectionTitle title="Informasi Umum" />

                        <div className="grid gap-4 text-sm mt-4">
                            {/* Name */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Nama Pengguna</p>
                                <p className="font-medium">
                                    {user?.name ? capitalizeEachWord(user?.name) : "-"}
                                </p>
                            </div>

                            {/* Gender */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Jenis Kelamin</p>
                                <p className="font-medium">
                                    {genderMap[user?.self_subject?.gender ?? ""] ?? "-"}
                                </p>
                            </div>

                            {/* Age */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Usia</p>
                                <p className="font-medium">
                                    {user?.self_subject?.age ?? "-"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Email</p>
                                <p className="font-medium">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Kontak</p>
                                <p className="font-medium">
                                    {user?.contact}
                                </p>
                            </div>

                            {/* Domisili */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Domisili</p>
                                <p className="font-medium">
                                    {user?.domicile ? capitalizeEachWord(user?.domicile) : "-"}
                                </p>
                            </div>

                            {/* Objective */}
                            <div className="flex justify-between">
                                <p className="text-netral-600">Tujuan Menggunakan Platform</p>
                                <p className="font-medium">
                                    {user?.objective ? capitalizeEachWord(user?.objective) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* School Information */}
                    {isSchool && (
                        <div>
                            <SectionTitle title="Informasi Sekolah" />

                            <div className="grid gap-4 text-sm mt-4">
                                {/* School Name */}
                                <div className="flex justify-between">
                                    <p className="text-netral-600">Nama Sekolah</p>
                                    <p className="font-medium">
                                        {user?.school_name ? capitalizeEachWord(user?.school_name) : "-"}
                                    </p>
                                </div>

                                {/* School Level */}
                                <div className="flex justify-between">
                                    <p className="text-netral-600">Jenjang Pendidikan</p>
                                    <p className="font-medium">
                                        {user?.school_level ?? "-"}
                                    </p>
                                </div>

                                {/* School Address */}
                                <div className="flex justify-between">
                                    <p className="text-netral-600">Alamat Sekolah</p>
                                    <p className="font-medium">
                                        {user?.school_address ? capitalizeEachWord(user?.school_address) : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subject Information */}
                    {isParent && (
                        <div>
                            <SectionTitle title="Informasi Keluarga" />

                            <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                                {children.length === 0 ? (
                                    <p className="text-netral-500">Tidak ada data anak</p>
                                ) : (
                                    children.map((child, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-3 space-y-2"
                                        >
                                            <div className="flex justify-between">
                                                <p className="text-netral-600">Nama</p>
                                                <p className="font-medium">
                                                    {capitalizeEachWord(child.name)}
                                                </p>
                                            </div>

                                            <div className="flex justify-between">
                                                <p className="text-netral-600">Jenis Kelamin</p>
                                                <p className="font-medium">
                                                    {genderMap[child.gender] ?? "-"}
                                                </p>
                                            </div>

                                            <div className="flex justify-between">
                                                <p className="text-netral-600">Usia</p>
                                                <p className="font-medium">
                                                    {child.age ? `${child.age} tahun` : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
