import { useState } from "react";

import { UserCardProps } from "@/types/user";

import SectionTitle from "@/shared/components/ui/SectionTitle";
import UpdateProfileModal from "../Components/modal/UpdateProfileModal";

import { capitalizeEachWord } from "@/shared/utils/capitalize";

export default function ProfileInformationCard({
    user,
    subject
}: UserCardProps) {
    const [open, setOpen] = useState(false);
    const isSuperadmin = user.role === "superadmin";

    return (
        <>
            <div className="bg-netral-100 rounded-xl border border-netral-300 p-6 w-full lg:max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <SectionTitle title={isSuperadmin ? "Informasi Akun Administrator" : "Informasi Umum"} />

                    <button
                        onClick={() => setOpen(true)}
                        className="text-sm text-primary font-medium hover:underline cursor-pointer"
                    >
                        Ubah
                    </button>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Nama Lengkap</span>
                        <span className="text-netral-900">
                            {capitalizeEachWord(user.name)}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Email</span>
                        <span className="text-netral-900">
                            {user.email}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Kontak</span>
                        <span className="text-netral-900">
                            {user.contact ?? "(Belum diatur)"}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Domisili</span>
                        <span className="text-netral-900">
                            {user.domicile ? capitalizeEachWord(user.domicile) : "(Belum diatur)"}
                        </span>
                    </div>

                    {!isSuperadmin && (
                        <>
                            <div className="flex justify-between font-medium">
                                <span className="text-netral-600">Usia</span>
                                <span className="text-netral-900">
                                    {subject?.age ?? "(Belum diatur)"}
                                </span>
                            </div>

                            <div className="flex justify-between font-medium">
                                <span className="text-netral-600">Jenis Kelamin</span>
                                <span className="text-netral-900">
                                    {
                                        subject?.gender === "male"
                                            ? "Laki-laki"
                                            : subject?.gender === "female"
                                                ? "Perempuan"
                                                : "(Belum diatur)"
                                    }
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <UpdateProfileModal
                isOpen={open}
                onClose={() => setOpen(false)}
                user={user}
                subject={subject}
            />
        </>
    );
}
