import { useState } from "react";

import { UserCardProps } from "@/types/user";

import SectionTitle from "@/shared/components/ui/SectionTitle";
import UpdatePasswordModal from "../Components/modal/UpdatePasswordModal";

import { formatDateTime } from "@/shared/utils/formatDate";

export default function PasswordInformationCard({
    user
}: UserCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-netral-100 rounded-xl border border-netral-300 p-6 w-full lg:max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <SectionTitle title="Informasi Akun" />

                    <button
                        onClick={() => setOpen(true)}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Ubah Password
                    </button>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Email</span>
                        <span className="text-netral-900">
                            {user.email}
                        </span>
                    </div>

                    <div className="flex justify-between font-medium">
                        <span className="text-netral-600">Terakhir Diperbarui</span>
                        <span className="text-netral-900">
                            {formatDateTime(user.updated_at as string)}
                        </span>
                    </div>
                </div>
            </div>

            <UpdatePasswordModal
                isOpen={open}
                onClose={() => setOpen(false)}
                user={user}
            />
        </>
    );
}
