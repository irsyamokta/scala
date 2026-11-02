import { useState } from "react";

import { UserCardProps } from "@/types/user";

import SectionTitle from "@/shared/components/ui/SectionTitle";
import UpdateProfileSchoolModal from "../Components/modal/UpdateProfileSchoolModal";

import { capitalizeEachWord, capitalized } from "@/shared/utils/capitalize";

export default function SchoolInformationCard({
    user,
}: UserCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-netral-100 rounded-xl border border-netral-300 p-6 w-full lg:max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <SectionTitle title="Informasi Sekolah" />

                    <button
                        onClick={() => setOpen(true)}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Ubah
                    </button>
                </div>

                <div className="space-y-3 text-sm">

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Jenjang Sekolah</span>
                        <span className="text-netral-900">
                            {user.school_level ?? "(Belum diatur)"}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Nama Sekolah</span>
                        <span className="text-netral-900">
                            {user.school_name ? capitalized(user.school_name) : "(Belum diatur)"}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Alamat Sekolah</span>
                        <span className="text-netral-900">
                            {user.school_address ? capitalizeEachWord(user.school_address) : "(Belum diatur)"}
                        </span>
                    </div>
                </div>
            </div>

            <UpdateProfileSchoolModal
                isOpen={open}
                onClose={() => setOpen(false)}
                user={user}
            />
        </>
    );
}
