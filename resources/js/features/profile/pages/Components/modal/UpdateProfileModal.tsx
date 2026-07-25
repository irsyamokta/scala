import { useModalForm } from "@/shared/hooks/useModalForm";

import { UserProfileModalProps, UserProfileForm } from "@/types/user";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import { Modal } from "@/shared/components/ui/modal";

export default function UpdateProfileModal({
    isOpen,
    onClose,
    user,
    subject,
}: UserProfileModalProps) {

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
        isEditing
    } = useModalForm<UserProfileForm>({
        isOpen,
        onClose,
        initialValues: {
            name: "",
            domicile: "",
            contact: "",
            age: subject?.age ?? "",
            gender: subject?.gender ?? "",
        },
        editData: user,
        editId: user?.id,
        createMessage: "Informasi umum berhasil disimpan",
        updateMessage: "Informasi umum berhasil diperbarui",
        storeRoute: "profile.update",
        updateRoute: "profile.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ubah Informasi Umum"
            formId="update-profile-form"
            submitLabel="Simpan Perubahan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-105"
        >
            <Form
                id="update-profile-form"
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
                    error={serverErrors.name}
                />

                {/* Domicile */}
                <Input
                    label="Domisili"
                    name="domicile"
                    placeholder="Masukkan alamat domisili Anda"
                    value={data.domicile}
                    onChange={(e) => setData("domicile", e.target.value)}
                    error={serverErrors.domicile}
                />

                {/* Contact */}
                <Input
                    label="Kontak"
                    name="contact"
                    type="number"
                    placeholder="Masukkan kontak Anda"
                    value={data.contact}
                    onChange={(e) => setData("contact", e.target.value)}
                    error={serverErrors.contact}
                />

                {/* Age */}
                <Input
                    label="Usia"
                    name="age"
                    type="number"
                    placeholder="Masukkan usia Anda"
                    value={data.age}
                    onChange={(e) => setData("age", e.target.value)}
                    error={serverErrors.age}
                />

                {/* Gender */}
                <RadioButtonGroup
                    label="Jenis Kelamin"
                    name="gender"
                    height="h-10"
                    options={[
                        { value: "male", label: "Laki-laki" },
                        { value: "female", label: "Perempuan" },
                    ]}
                    value={data.gender}
                    onChange={(value) => setData("gender", value)}
                />
            </Form>
        </Modal>
    );
}
