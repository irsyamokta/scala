import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { LuUpload, LuPencil, LuFileSpreadsheet } from "react-icons/lu";

import { useModalForm } from "@/shared/hooks/useModalForm";

import { SubjectModalProps, SubjectForm } from "@/types/subject";

import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";
import Select from "@/shared/components/forms/Select";
import FileInput from "@/shared/components/forms/FileInput";
import { Modal } from "@/shared/components/ui/modal";

type TabMode = "manual" | "import";

export default function SubjectStudentModal({
    isOpen,
    onClose,
    classes = [],
    subject,
}: SubjectModalProps) {
    const [tab, setTab] = useState<TabMode>("manual");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const isEditing = !!subject;

    const {
        data,
        setData,
        handleSubmit,
        loading,
        serverErrors,
    } = useModalForm<SubjectForm>({
        isOpen,
        onClose,
        initialValues: {
            name: "",
            nis: "",
            gender: "",
            tanggal_lahir: "",
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

    function handleImportSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        router.post(
            route("student.import.store"),
            { file },
            {
                forceFormData: true,
                onSuccess: () => { setFile(null); onClose(); },
                onFinish: () => setUploading(false),
            }
        );
    }

    // Reset tab ke manual saat modal dibuka ulang
    const handleClose = () => {
        setTab("manual");
        setFile(null);
        onClose();
    };

    const title = isEditing
        ? "Ubah Detail Siswa"
        : tab === "manual"
            ? "Tambah Siswa"
            : "Import Siswa dari Excel";

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            formId={tab === "manual" ? "subject-school-form" : "subject-import-form"}
            submitLabel={
                tab === "manual"
                    ? "Simpan"
                    : uploading
                        ? "Memproses..."
                        : "Upload & Proses"
            }
            cancelLabel="Batal"
            loading={loading || uploading}
            position="right"
            className="max-w-110"
        >
            {/* Tab switcher — hanya saat create */}
            {!isEditing && (
                <div className="flex border-b border-netral-200 px-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setTab("manual")}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                            tab === "manual"
                                ? "border-primary text-primary"
                                : "border-transparent text-netral-500 hover:text-netral-700"
                        }`}
                    >
                        <LuPencil size={14} />
                        Input Manual
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("import")}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                            tab === "import"
                                ? "border-primary text-primary"
                                : "border-transparent text-netral-500 hover:text-netral-700"
                        }`}
                    >
                        <LuUpload size={14} />
                        Import Excel
                    </button>
                </div>
            )}

            {/* ---- TAB: MANUAL ---- */}
            {(tab === "manual" || isEditing) && (
                <Form
                    id="subject-school-form"
                    onSubmit={handleSubmit}
                    className="p-4 space-y-5"
                >
                    {/* Nama */}
                    <Input
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        error={serverErrors.name}
                    />

                    {/* NIS */}
                    <Input
                        label="NIS"
                        required
                        inputMode="numeric"
                        placeholder="Nomor Induk Siswa"
                        value={data.nis ?? ""}
                        onChange={(e) =>
                            setData("nis", e.target.value.replace(/[^0-9]/g, ""))
                        }
                        error={serverErrors.nis}
                    />

                    {/* Jenis Kelamin */}
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

                    {/* Tanggal Lahir */}
                    <Input
                        label="Tanggal Lahir"
                        required
                        placeholder="YYYY-MM-DD (contoh: 2010-05-12)"
                        value={data.tanggal_lahir ?? ""}
                        onChange={(e) => setData("tanggal_lahir", e.target.value)}
                        hint="Usia dihitung otomatis dari tanggal lahir"
                        error={serverErrors.tanggal_lahir}
                    />

                    {/* Kelas */}
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
            )}

            {/* ---- TAB: IMPORT ---- */}
            {tab === "import" && !isEditing && (
                <form
                    id="subject-import-form"
                    onSubmit={handleImportSubmit}
                    className="p-4 space-y-5"
                >
                    {/* Download template */}
                    <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-netral-800">
                                Download Template
                            </p>
                            <p className="text-xs text-netral-500">
                                Kolom: nama, nis, jenis_kelamin, tanggal_lahir, kelas
                            </p>
                        </div>
                        <a
                            href={route("student.import.template")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-white transition"
                        >
                            <LuUpload size={12} />
                            Download
                        </a>
                    </div>

                    {/* File upload */}
                    <FileInput
                        ref={fileRef}
                        label="File Excel"
                        required
                        variant="card"
                        accept=".xlsx,.xls"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />

                    {/* Preview file */}
                    {file && (
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                            <LuFileSpreadsheet size={18} className="text-green-600 shrink-0" />
                            <span className="truncate text-netral-700">{file.name}</span>
                            <span className="ml-auto shrink-0 text-xs text-netral-400">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700 space-y-1">
                        <p className="font-semibold">Catatan:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            <li>Kelas akan dibuat otomatis jika belum ada.</li>
                            <li>Siswa dengan NIS yang sama akan diperbarui.</li>
                            <li>Tanggal lahir format: YYYY-MM-DD.</li>
                        </ul>
                    </div>
                </form>
            )}
        </Modal>
    );
}
