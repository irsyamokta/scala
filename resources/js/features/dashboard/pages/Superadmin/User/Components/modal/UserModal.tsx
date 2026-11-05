import { useModalForm } from "@/shared/hooks/useModalForm";

import { UserModalProps, UserForm } from "@/types/user";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import { Modal } from "@/shared/components/ui/modal";

export default function UserModal({
    isOpen,
    onClose,
    user
}: UserModalProps) {
    const editData: UserForm | null = user
        ? { name: user.name, email: user.email, contact: user.contact, role: user.role, password: "" }
        : null;

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
        isEditing,
    } = useModalForm<UserForm>({
        isOpen,
        onClose,
        initialValues: {
            name: "",
            email: "",
            contact: "",
            role: "",
            password: "",
        },
        editData,
        editId: user?.id,
        createMessage: "Pengguna berhasil disimpan",
        updateMessage: "Pengguna berhasil diperbarui",
        storeRoute: "user.store",
        updateRoute: "user.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Ubah Pengguna" : "Tambah Pengguna"}
            formId="user-form"
            submitLabel="Simpan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-105"
        >
            <Form
                id="user-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* Name */}
                <Input
                    label="Nama lengkap"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    error={serverErrors.name}
                />

                {/* Email */}
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Masukkan usia Anda"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    error={serverErrors.email}
                />

                {/* Contact */}
                <Input
                    label="Kontak"
                    name="contact"
                    type="number"
                    placeholder="cth: 08123456789"
                    value={data.contact}
                    onChange={(e) => setData("contact", e.target.value)}
                    required
                    error={serverErrors.contact}
                />

                {/* Role */}
                <RadioButtonGroup
                    label="Role"
                    name="role"
                    height="h-10"
                    options={[
                        { value: "parent", label: "Orang Tua" },
                        { value: "school", label: "Sekolah" },
                        { value: "general", label: "Umum" },
                        { value: "psychologist", label: "Psikolog" },
                    ]}
                    value={data.role}
                    required
                    onChange={(value) => setData("role", value)}
                />

                {/* Password */}
                <Input
                    label={isEditing ? "Password baru (opsional)" : "Password"}
                    name="password"
                    type="password"
                    placeholder={isEditing ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password Anda"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required={!isEditing}
                    error={serverErrors.password}
                />
            </Form>
        </Modal>
    );
}
