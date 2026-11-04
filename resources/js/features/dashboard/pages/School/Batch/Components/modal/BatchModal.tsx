import { useState } from "react";
import { useModalForm } from "@/shared/hooks/useModalForm";

import Form from "@/shared/components/forms/Form";
import InputField from "@/shared/components/forms/InputField";
import Select from "@/shared/components/forms/Select";
import { Modal } from "@/shared/components/ui/modal";

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
}

/** Format input otomatis DD/MM/YY, hanya izinkan digit */
function formatDmy(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Format input otomatis HH:MM dengan batas HH ≤ 23, MM ≤ 59.
 * Jika digit ke-1 > 2, langsung paksa jadi 0x (misal "3" → "03").
 */
function formatHhmm(raw: string): string {
    let digits = raw.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 1) {
        const h1 = parseInt(digits[0], 10);
        if (h1 > 2) digits = "0" + digits.slice(0, 3);
    }
    if (digits.length >= 2) {
        const hh = parseInt(digits.slice(0, 2), 10);
        if (hh > 23) digits = "23" + digits.slice(2);
    }
    if (digits.length >= 3) {
        const m1 = parseInt(digits[2], 10);
        if (m1 > 5) digits = digits.slice(0, 2) + "5" + digits.slice(3, 4);
    }
    if (digits.length >= 4) {
        const mm = parseInt(digits.slice(2, 4), 10);
        if (mm > 59) digits = digits.slice(0, 2) + "59";
    }

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

/** Konversi DD/MM/YY + HH:MM → YYYY-MM-DD HH:MM:00 untuk backend */
function toIsoDatetime(date: string, time: string): string {
    const [d, m, y] = date.split("/");
    if (!d || !m || !y || y.length < 2) return "";
    const fullYear = `20${y}`;
    const [hh, mm] = (time || "00:00").split(":");
    if (!hh || !mm || mm.length < 2) return "";
    return `${fullYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")} ${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
}

/** Validasi tanggal DD/MM/YY tidak di masa lalu */
function validateExpiry(date: string, time: string): string | null {
    const [d, m, y] = date.split("/");
    if (!d || !m || !y || y.length < 2) return null;

    const fullYear = parseInt(`20${y}`, 10);
    const month    = parseInt(m, 10) - 1;
    const day      = parseInt(d, 10);

    if (isNaN(fullYear) || isNaN(month) || isNaN(day)) return "Tanggal tidak valid.";

    const [hh, mm] = (time || "00:00").split(":");
    const expiry = new Date(fullYear, month, day, parseInt(hh || "0", 10), parseInt(mm || "0", 10));

    if (isNaN(expiry.getTime())) return "Tanggal tidak valid.";
    if (expiry < new Date()) return "Tanggal kedaluwarsa tidak boleh di masa lalu.";

    return null;
}

export default function BatchModal({
    isOpen,
    onClose,
    classes,
    instruments,
}: BatchModalProps) {
    const [dateDisplay, setDateDisplay] = useState("");
    const [timeDisplay, setTimeDisplay] = useState("");
    const [dateError, setDateError]     = useState<string | null>(null);

    const dateComplete = dateDisplay.length === 8; // DD/MM/YY = 8 chars

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<BatchForm>({
        isOpen,
        onClose,
        initialValues: {
            class_id: "",
            instrument_id: "",
            label: "",
            expires_at: "",
        },
        createMessage: "Batch Skrining berhasil dibuat",
        storeRoute: "batch.store",
    });

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatDmy(e.target.value);
        setDateDisplay(formatted);
        setDateError(null);

        // Jika tanggal dihapus, reset juga waktu dan expires_at
        if (!formatted) {
            setTimeDisplay("");
            setData("expires_at", "");
            return;
        }

        // Validasi hanya saat tanggal lengkap (DD/MM/YY)
        if (formatted.length === 8) {
            const err = validateExpiry(formatted, timeDisplay);
            setDateError(err);
            setData("expires_at", err ? "" : toIsoDatetime(formatted, timeDisplay));
        } else {
            setData("expires_at", "");
        }
    }

    function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatHhmm(e.target.value);
        setTimeDisplay(formatted);

        if (dateDisplay.length === 8) {
            const err = validateExpiry(dateDisplay, formatted);
            setDateError(err);
            setData("expires_at", err ? "" : toIsoDatetime(dateDisplay, formatted));
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
            title="Buat Batch Skrining"
            subtitle="Link tes akan di-generate otomatis. Siswa mengakses link atau QR code dengan NIS + tanggal lahir."
            formId="batch-form"
            submitLabel="Buat Batch"
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
                    error={serverErrors.class_id}
                />

                <Select
                    label="Instrumen"
                    required
                    placeholder="-- Pilih Instrumen --"
                    options={instrumentOptions}
                    value={data.instrument_id}
                    onChange={(val) => setData("instrument_id", String(val))}
                    error={serverErrors.instrument_id}
                />

                <div className="grid grid-cols-2 gap-3">
                    <InputField
                        label="Tanggal Kedaluwarsa"
                        placeholder="DD/MM/YY"
                        inputMode="numeric"
                        value={dateDisplay}
                        onChange={handleDateChange}
                        hint={dateDisplay ? undefined : "Kosongkan jika tanpa batas waktu"}
                        error={dateError ?? serverErrors.expires_at}
                    />
                    <InputField
                        label="Waktu (24 jam)"
                        placeholder="HH:MM"
                        inputMode="numeric"
                        value={timeDisplay}
                        onChange={handleTimeChange}
                        disabled={!dateComplete}
                        hint={dateComplete ? "Contoh: 23:59" : undefined}
                    />
                </div>
            </Form>
        </Modal>
    );
}
