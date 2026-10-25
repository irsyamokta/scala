import { useModalForm } from "@/shared/hooks/useModalForm";

import Form from "@/shared/components/forms/Form";
import InputField from "@/shared/components/forms/InputField";
import Select from "@/shared/components/forms/Select";
import DateTimePicker from "@/shared/components/forms/DateTimePicker";
import { Modal } from "@/shared/components/ui/modal";

interface PinBatchForm {
    class_id: string;
    instrument_id: string;
    label: string;
    expires_at: string;
}

interface PinBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
}

export default function PinBatchModal({
    isOpen,
    onClose,
    classes,
    instruments,
}: PinBatchModalProps) {
    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<PinBatchForm>({
        isOpen,
        onClose,
        initialValues: {
            class_id: "",
            instrument_id: "",
            label: "",
            expires_at: "",
        },
        createMessage: "Batch PIN berhasil dibuat",
        storeRoute: "pin-batch.store",
    });

    const classOptions = [
        { value: "all", label: "— Semua Kelas —" },
        ...classes.map((c) => ({ value: c.id, label: c.class_name })),
    ];

    const instrumentOptions = instruments.map((inst) => ({
        value: inst.id,
        label: inst.name,
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Buat PIN Batch"
            subtitle="PIN akan di-generate otomatis untuk setiap siswa di kelas yang dipilih."
            formId="pin-batch-form"
            submitLabel="Buat Batch & Generate PIN"
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-110"
        >
            <Form
                id="pin-batch-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* Label */}
                <InputField
                    label="Label Batch"
                    required
                    placeholder="Contoh: SDQ Kelas 9A - September 2026"
                    value={data.label}
                    onChange={(e) => setData("label", e.target.value)}
                    error={serverErrors.label}
                />

                {/* Kelas */}
                <Select
                    label="Kelas"
                    required
                    placeholder="-- Pilih Kelas --"
                    options={classOptions}
                    value={data.class_id}
                    onChange={(val) => setData("class_id", String(val))}
                    error={serverErrors.class_id}
                />

                {/* Instrumen */}
                <Select
                    label="Instrumen"
                    required
                    placeholder="-- Pilih Instrumen --"
                    options={instrumentOptions}
                    value={data.instrument_id}
                    onChange={(val) => setData("instrument_id", String(val))}
                    error={serverErrors.instrument_id}
                />

                {/* Tanggal & Waktu Kedaluwarsa */}
                <DateTimePicker
                    label="Tanggal Kedaluwarsa (Opsional)"
                    variant="datetime"
                    value={data.expires_at}
                    onChange={(val) => setData("expires_at", val)}
                    hint="Kosongkan jika tidak ada batas waktu"
                    error={serverErrors.expires_at}
                />
            </Form>
        </Modal>
    );
}
