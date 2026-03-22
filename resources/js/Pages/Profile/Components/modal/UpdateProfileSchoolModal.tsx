import { useModalForm } from "@/hooks/useModalForm";

import { UserProfileModalProps, UserProfileSchoolForm } from "@/types/user";

import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import RadioButtonGroup from "@/Components/form/input/RadioButtonGroup";
import { Modal } from "@/Components/ui/modal";

export default function UpdateProfileModal({
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
    } = useModalForm<UserProfileSchoolForm>({
        isOpen,
        onClose,
        initialValues: {
            school_name: user?.school_name ?? "",
            school_level: user?.school_level ?? "",
            school_address: user?.school_address ?? "",
        },
        editData: user,
        editId: user?.id,
        createMessage: "Informasi sekolah berhasil disimpan",
        updateMessage: "Informasi sekolah berhasil diperbarui",
        storeRoute: "profile.school.update",
        updateRoute: "profile.school.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ubah Informasi Sekolah"
            formId="update-profile-school-form"
            submitLabel="Simpan Perubahan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-105"
        >
            <Form
                id="update-profile-school-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* School Level */}
                <RadioButtonGroup
                    label="Jenjang Sekolah"
                    name="school_level"
                    height="h-10"
                    options={[
                        { value: "TK", label: "TK" },
                        { value: "SD/MI", label: "SD/MI" },
                        { value: "SMP/MTs", label: "SMP/MTs" },
                        { value: "SMA/SMK", label: "SMA/SMK/MA" },
                    ]}
                    value={data.school_level}
                    onChange={(value) => setData("school_level", value)}
                />

                {/* School Name */}
                <Input
                    label="Nama Sekolah"
                    name="school_name"
                    placeholder="Masukkan nama sekolah"
                    value={data.school_name}
                    onChange={(e) => setData("school_name", e.target.value)}
                    error={serverErrors.school_name}
                />

                {/* School Address */}
                <Input
                    label="Alamat Sekolah"
                    name="school_address"
                    placeholder="Masukkan alamat sekolah Anda"
                    value={data.school_address}
                    onChange={(e) => setData("school_address", e.target.value)}
                    error={serverErrors.school_address}
                />
            </Form>
        </Modal>
    );
}
