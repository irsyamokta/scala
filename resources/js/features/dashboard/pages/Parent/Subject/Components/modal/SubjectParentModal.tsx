import { useModalForm } from "@/shared/hooks/useModalForm";

import { SubjectModalProps, SubjectForm } from "@/types/subject";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import Select from "@/shared/components/forms/Select";
import { Modal } from "@/shared/components/ui/modal";

export default function SubjectParentModal({
    isOpen,
    onClose,
    subject
}: SubjectModalProps) {
    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
        isEditing,
    } = useModalForm<SubjectForm>({
        isOpen,
        onClose,
        initialValues: {
            name: "",
            gender: "",
            age: "",
            has_previous_screening: false,
            last_result: "",
        },
        editData: subject,
        editId: subject?.id,
        createMessage: "Profil keluarga berhasil disimpan",
        updateMessage: "Profil keluarga berhasil diperbarui",
        storeRoute: "subject.store",
        updateRoute: "subject.update",
    });

    const canSelectResult = data.has_previous_screening === true;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Ubah Detail Keluarga" : "Tambah Keluarga"}
            formId="subject-parent-form"
            submitLabel="Simpan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-110"
        >
            <Form
                id="subject-parent-form"
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
                    required
                    onChange={(value) => setData("gender", value)}
                />

                {/* Age */}
                <Input
                    label="Usia"
                    name="age"
                    type="number"
                    placeholder="Masukkan usia"
                    value={data.age}
                    onChange={(e) => setData("age", e.target.value)}
                    required
                    error={serverErrors.age}
                />

                {/* Has Previous Screening */}
                <RadioButtonGroup
                    label="Sudah pernah melakukan skrining?"
                    name="has_previous_screening"
                    height="h-10"
                    options={[
                        { value: true, label: "Ya, sudah pernah" },
                        { value: false, label: "Belum, ini pertama kali" },
                    ]}
                    value={data.has_previous_screening}
                    required
                    onChange={(value) => setData("has_previous_screening", value)}
                />

                {/* Last Result */}
                <Select
                    label="Hasil skrining terakhir"
                    placeholder="Pilih hasil skrining terakhir"
                    options={[
                        { value: "Normal", label: "Normal" },
                        { value: "Borderline", label: "Borderline" },
                        { value: "Abnormal", label: "Abnormal" },
                        { value: "Tidak Terindikasi", label: "Tidak Terindikasi" },
                        { value: "Terindikasi", label: "Terindikasi" },
                    ]}
                    value={data.last_result ?? "-"}
                    onChange={(value) => setData("last_result", value)}
                    error={serverErrors.last_result}
                    required={canSelectResult}
                    disabled={!canSelectResult}
                />
            </Form>
        </Modal>
    );
}
