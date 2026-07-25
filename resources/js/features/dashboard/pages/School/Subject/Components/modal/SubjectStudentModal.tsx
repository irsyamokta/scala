import { useModalForm } from "@/shared/hooks/useModalForm";

import { SubjectModalProps, SubjectForm } from "@/types/subject";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import Select from "@/shared/components/forms/Select";
import { Modal } from "@/shared/components/ui/modal";

export default function SubjectStudentModal({
    isOpen,
    onClose,
    classes = [],
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
        createMessage: "Profil siswa berhasil disimpan",
        updateMessage: "Profil siswa berhasil diperbarui",
        storeRoute: "subject.store",
        updateRoute: "subject.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Ubah Detail Siswa" : "Tambah Siswa"}
            formId="subject-school-form"
            submitLabel="Simpan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-110"
        >
            <Form
                id="subject-school-form"
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
                    placeholder="Masukkan usia anak"
                    value={data.age}
                    onChange={(e) => setData("age", e.target.value)}
                    required
                    error={serverErrors.age}
                />

                {/* Class */}
                <Select
                    label="Kelas"
                    placeholder="Pilih kelas"
                    options={(classes ?? []).map((c) => ({
                        value: String(c.value ?? c.id),
                        label: c.label ?? c.class_name,
                    }))}
                    value={data.class_id ?? ""}
                    onChange={(value) => setData("class_id", value)}
                    error={serverErrors.class_id}
                    required
                />
            </Form>
        </Modal>
    );
}
