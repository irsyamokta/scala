import { useModalForm } from "@/hooks/useModalForm";

import { UserProfileModalProps, UserPasswordForm } from "@/types/user";

import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import { Modal } from "@/Components/ui/modal";

export default function UpdatePasswordModal({
    isOpen,
    onClose,
    user
}: UserProfileModalProps) {

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<UserPasswordForm>({
        isOpen,
        onClose,
        initialValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
        editData: user,
        editId: user?.id,
        createMessage: "Password berhasil disimpan",
        updateMessage: "Password berhasil diperbarui",
        storeRoute: "password.update",
        updateRoute: "password.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ubah Password"
            formId="update-password-form"
            submitLabel="Simpan Perubahan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-105"
        >
            <Form
                id="update-password-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* Current Password */}
                <Input
                    label="Password Saat Ini"
                    name="current_password"
                    placeholder="Masukkan password saat ini"
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    error={serverErrors.current_password}
                />

                {/* New Password */}
                <Input
                    label="Password Baru"
                    name="password"
                    type="password"
                    placeholder="Masukkan password baru"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={serverErrors.password}
                />

                {/* Confirm Password */}
                <Input
                    label="Konfirmasi Password Baru"
                    name="password_confirmation"
                    type="password"
                    placeholder="Masukkan konfirmasi password baru"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    error={serverErrors.password_confirmation}
                />
            </Form>
        </Modal>
    );
}
