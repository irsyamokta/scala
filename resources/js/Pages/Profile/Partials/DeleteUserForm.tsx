import { useState } from "react";

import SectionTitle from "@/Components/SectionTitle";
import Button from "@/Components/ui/button/Button";
import DeleteUserModal from "../Components/modal/DeleteUserModal";

export default function PasswordInformationCard() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-netral-100 rounded-xl border border-netral-300 p-6 w-full">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <SectionTitle title="Hapus Akun" />
                </div>

                {/* Body */}
                <div className="space-y-3 text-sm">
                    <div className="flex font-medium">
                        <span className="text-netral-600">
                            Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya akan dihapus secara permanen. Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm mt-4">
                    <Button
                        onClick={() => setOpen(true)}
                        className="text-sm bg-red-600 hover:bg-red-600/80 w-full md:w-56"
                    >
                        Hapus Akun
                    </Button>
                </div>
            </div>

            <DeleteUserModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
