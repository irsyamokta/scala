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
    const isSuperadmin = user?.role === "superadmin";

    const editData: UserProfileForm | null = user
        ? {
            name: user.name || "",
            domicile: user.domicile || "",
            contact: user.contact || "",
            age: subject?.age ? String(subject.age) : "",
            gender: subject?.gender || "",
            password: "",
        }
        : null;

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<UserProfileForm>({
        isOpen,
        onClose,
        initialValues: {
            name: "",
            domicile: "",
            contact: "",
            age: subject?.age ? String(subject.age) : "",
            gender: subject?.gender ?? "",
            password: "",
        },
        editData,
        editId: user?.id,
        createMessage: "Informasi profil berhasil disimpan",
        updateMessage: "Informasi profil berhasil diperbarui",
        storeRoute: "profile.update",
        updateRoute: "profile.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSuperadmin ? "Ubah Akun Administrator" : "Ubah Informasi Umum"}
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
                    required
                />

                {/* Domicile */}
                <Input
                    label="Domisili"
                    name="domicile"
                    placeholder="Masukkan alamat domisili Anda"
                    value={data.domicile}
                    onChange={(e) => setData("domicile", e.target.value)}
                    error={serverErrors.domicile}
                    required={!isSuperadmin}
                />

                {/* Contact */}
                <Input
                    label="Kontak"
                    name="contact"
                    type="number"
                    placeholder="Masukkan kontak Anda (cth: 08123456789)"
                    value={data.contact}
                    onChange={(e) => setData("contact", e.target.value)}
                    error={serverErrors.contact}
                    required={!isSuperadmin}
                />

                {/* Age & Gender (Khusus non-superadmin) */}
                {!isSuperadmin && (
                    <>
                        {/* Age */}
                        <Input
                            label="Usia"
                            name="age"
                            type="number"
                            placeholder="Masukkan usia Anda"
                            value={data.age}
                            onChange={(e) => setData("age", e.target.value)}
                            error={serverErrors.age}
                            required
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
                    </>
                )}

                {/* Password Baru (Khusus Administrator) */}
                {isSuperadmin && (
                    <Input
                        label="Password Baru (opsional)"
                        name="password"
                        type="password"
                        placeholder="Kosongkan jika tidak ingin mengubah"
                        value={data.password ?? ""}
                        onChange={(e) => setData("password", e.target.value)}
                        error={serverErrors.password}
                    />
                )}
            </Form>
        </Modal>
    );
}
