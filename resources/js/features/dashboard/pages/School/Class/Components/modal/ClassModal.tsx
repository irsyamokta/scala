import { useModalForm } from "@/shared/hooks/useModalForm";

import { ClassModalProps, ClassForm } from "@/types/subject";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import Select from "@/shared/components/forms/Select";
import { Modal } from "@/shared/components/ui/modal";

export default function ClassModal({
    isOpen,
    onClose,
    classes
}: ClassModalProps) {
    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
        isEditing,
    } = useModalForm<ClassForm>({
        isOpen,
        onClose,
        initialValues: {
            class_name: "",
        },
        editData: classes,
        editId: classes?.id,
        createMessage: "Kelas berhasil disimpan",
        updateMessage: "Kelas berhasil diperbarui",
        storeRoute: "class.store",
        updateRoute: "class.update",
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Ubah Kelas" : "Tambah Kelas"}
            formId="class-form"
            submitLabel="Simpan"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-110"
        >
            <Form
                id="class-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* Name */}
                <Input
                    label="Nama Kelas"
                    name="name"
                    placeholder="Masukkan nama kelas"
                    value={data.class_name}
                    onChange={(e) => setData("class_name", e.target.value)}
                    required
                    hint={`Tambahkan kata "Kelas" sebelum memberi nama kelas`}
                    error={serverErrors.class_name}
                />

            </Form>
        </Modal>
    );
}
