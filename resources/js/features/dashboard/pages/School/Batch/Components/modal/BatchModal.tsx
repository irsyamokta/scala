import { useState, useEffect, useMemo } from "react";
import { useModalForm } from "@/shared/hooks/useModalForm";

import Form from "@/shared/components/forms/Form";
import InputField from "@/shared/components/forms/InputField";
import Select from "@/shared/components/forms/Select";
import DateSegmentInput from "@/shared/components/forms/DateSegmentInput";
import TimeSegmentInput from "@/shared/components/forms/TimeSegmentInput";
import { Modal } from "@/shared/components/ui/modal";
import { Batch } from "@/types/batch";
import {
    toIsoDatetime,
    parseExpiresAt,
    validateExpiry,
} from "@/shared/utils/dateTime";

interface BatchForm {
    class_id: string;
    instrument_id: string;
    label: string;
    expires_at: string;
}

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
    batch?: Batch | null;
}

export default function BatchModal({
    isOpen,
    onClose,
    classes,
    instruments,
    batch,
}: BatchModalProps) {
    const [dateDisplay, setDateDisplay] = useState("");
    const [timeDisplay, setTimeDisplay] = useState("");
    const [dateError, setDateError] = useState<string | null>(null);

    const hasTested = (batch?.tested_count ?? 0) > 0;
    const isDateComplete = dateDisplay.length === 10; // DD/MM/YYYY = 10 chars

    const editData = useMemo(() => {
        if (!batch) return null;
        return {
            class_id: batch.class_id ?? "all",
            instrument_id: batch.instrument_id,
            label: batch.label,
            expires_at: batch.expires_at ?? "",
        };
    }, [batch?.id]);

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
        isEditing,
    } = useModalForm<BatchForm>({
        isOpen,
        onClose,
        initialValues: {
            class_id: "",
            instrument_id: "",
            label: "",
            expires_at: "",
        },
        editData,
        editId: batch?.id,
        createMessage: "Batch Skrining berhasil dibuat",
        updateMessage: "Batch Skrining berhasil diperbarui",
        storeRoute: "batch.store",
        updateRoute: "batch.update",
    });

    useEffect(() => {
        if (isOpen) {
            if (batch) {
                const parsed = parseExpiresAt(batch.expires_at);
                setDateDisplay(parsed.date);
                setTimeDisplay(parsed.time);
                setDateError(null);
            } else {
                setDateDisplay("");
                setTimeDisplay("");
                setDateError(null);
            }
        }
    }, [isOpen, batch?.id]);

    function handleDateChange(val: string) {
        setDateDisplay(val);
        setDateError(null);

        // Jika tanggal kosong, reset juga waktu dan expires_at
        if (!val) {
            setTimeDisplay("");
            setData("expires_at", "");
            return;
        }

        // Validasi saat tanggal lengkap (DD/MM/YYYY)
        if (val.length === 10) {
            const err = validateExpiry(val, timeDisplay, isEditing, batch?.expires_at);
            setDateError(err);
            setData("expires_at", err ? "" : toIsoDatetime(val, timeDisplay));
        } else {
            setData("expires_at", "");
        }
    }

    function handleTimeChange(val: string) {
        setTimeDisplay(val);

        if (dateDisplay.length === 10) {
            const err = validateExpiry(dateDisplay, val, isEditing, batch?.expires_at);
            setDateError(err);
            setData("expires_at", err ? "" : toIsoDatetime(dateDisplay, val));
        }
    }

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
            title={isEditing ? "Edit Batch Skrining" : "Buat Batch Skrining"}
            subtitle={
                isEditing
                    ? hasTested
                        ? "Siswa sudah mulai melakukan tes pada batch ini. Hanya label batch dan batas kedaluwarsa yang dapat diubah."
                        : "Perbarui informasi batch skrining."
                    : "Link tes akan di-generate otomatis. Siswa mengakses link atau QR code dengan NIS + tanggal lahir."
            }
            formId="batch-form"
            submitLabel={isEditing ? "Simpan Perubahan" : "Buat Batch"}
            cancelLabel="Batal"
            loading={loading}
            position="right"
            className="max-w-110"
        >
            <Form
                id="batch-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                <InputField
                    label="Label Batch"
                    required
                    placeholder="Contoh: SDQ Kelas 9A - September 2026"
                    value={data.label}
                    onChange={(e) => setData("label", e.target.value)}
                    error={serverErrors.label}
                />

                <Select
                    label="Kelas"
                    required
                    placeholder="-- Pilih Kelas --"
                    options={classOptions}
                    value={data.class_id}
                    onChange={(val) => setData("class_id", String(val))}
                    disabled={hasTested}
                    hint={hasTested ? "Kelas tidak dapat diubah karena sudah ada siswa yang mengikuti tes." : undefined}
                    error={serverErrors.class_id}
                />

                <Select
                    label="Instrumen"
                    required
                    placeholder="-- Pilih Instrumen --"
                    options={instrumentOptions}
                    value={data.instrument_id}
                    onChange={(val) => setData("instrument_id", String(val))}
                    disabled={hasTested}
                    hint={hasTested ? "Instrumen tidak dapat diubah karena sudah ada siswa yang mengikuti tes." : undefined}
                    error={serverErrors.instrument_id}
                />

                <div className="grid grid-cols-2 gap-3">
                    <DateSegmentInput
                        label="Tanggal Kedaluwarsa"
                        value={dateDisplay}
                        onChange={handleDateChange}
                        hint={dateDisplay ? undefined : "Kosongkan jika tanpa batas waktu"}
                        error={dateError ?? serverErrors.expires_at}
                    />
                    <TimeSegmentInput
                        label="Waktu (24 jam)"
                        value={timeDisplay}
                        onChange={handleTimeChange}
                        disabled={!isDateComplete}
                        hint={isDateComplete ? "Contoh: 23:59" : undefined}
                    />
                </div>
            </Form>
        </Modal>
    );
}
