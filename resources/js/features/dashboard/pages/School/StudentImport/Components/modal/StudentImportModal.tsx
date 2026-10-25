import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { LuFileSpreadsheet, LuUpload } from "react-icons/lu";

import { Modal } from "@/shared/components/ui/modal";
import FileInput from "@/shared/components/forms/FileInput";

interface StudentImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentImportModal({
    isOpen,
    onClose,
}: StudentImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleClose() {
        if (uploading) return;
        setFile(null);
        onClose();
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        router.post(
            route("student.import.store"),
            { file },
            {
                forceFormData: true,
                onSuccess: () => {
                    setFile(null);
                    onClose();
                },
                onFinish: () => setUploading(false),
            }
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Import Data Siswa"
            subtitle="Unggah file Excel berisi data siswa. Maksimal 5 MB."
            formId="student-import-form"
            submitLabel={uploading ? "Memproses..." : "Upload & Proses"}
            cancelLabel="Batal"
            loading={uploading}
            position="right"
            className="max-w-110"
        >
            <form
                id="student-import-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                {/* File upload */}
                <FileInput
                    ref={fileRef}
                    label="File Excel"
                    required
                    variant="card"
                    accept=".xlsx,.xls"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {/* Preview nama file */}
                {file && (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800">
                        <LuFileSpreadsheet
                            size={18}
                            className="text-green-600 shrink-0"
                        />
                        <span className="truncate text-gray-700 dark:text-gray-300">
                            {file.name}
                        </span>
                        <span className="ml-auto shrink-0 text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                        </span>
                    </div>
                )}

                {/* Info format kolom */}
                <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 space-y-1">
                    <p className="font-semibold">Format kolom yang dibutuhkan:</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                        <li><strong>nama</strong> — nama lengkap siswa</li>
                        <li><strong>nis</strong> — nomor induk siswa (opsional)</li>
                        <li><strong>jenis_kelamin</strong> — L atau P</li>
                        <li><strong>tanggal_lahir</strong> — format YYYY-MM-DD</li>
                        <li><strong>kelas</strong> — nama kelas yang sudah dibuat</li>
                    </ul>
                </div>
            </form>
        </Modal>
    );
}
