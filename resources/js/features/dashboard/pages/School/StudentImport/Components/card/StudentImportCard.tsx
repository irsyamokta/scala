import { LuUpload, LuFileSpreadsheet, LuUsers, LuDownload, LuClipboardList, LuKeyRound } from "react-icons/lu";
import Button from "@/shared/components/ui/button/Button";

interface StudentImportCardProps {
    classes: { id: string; class_name: string }[];
    onImport: () => void;
}

export default function StudentImportCard({ classes, onImport }: StudentImportCardProps) {
    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">

            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-netral-900">
                        Import Siswa
                    </h2>
                    <p className="text-sm text-netral-600 mt-1">
                        Upload data siswa dari file Excel untuk menambahkan secara massal.
                    </p>
                </div>

                <Button
                    size="lg"
                    startIcon={<LuUpload size={15} />}
                    onClick={onImport}
                    className="text-sm w-full md:w-auto whitespace-nowrap shrink-0"
                >
                    Import Siswa
                </Button>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StepItem
                    number="1"
                    icon={<LuDownload size={18} />}
                    title="Download Template"
                    desc="Unduh file template Excel dan isi data siswa sesuai kolom."
                    action={
                        <a href={route("student.import.template")} className="text-xs font-medium text-primary hover:underline">
                            Download template →
                        </a>
                    }
                />
                <StepItem
                    number="2"
                    icon={<LuFileSpreadsheet size={18} />}
                    title="Isi Data Siswa"
                    desc="Lengkapi kolom: nama, NIS, jenis kelamin, tanggal lahir, dan kelas."
                />
                <StepItem
                    number="3"
                    icon={<LuUpload size={18} />}
                    title="Upload File"
                    desc="Klik tombol Import Siswa, pilih file Excel, lalu proses."
                    action={
                        <button onClick={onImport} className="text-xs font-medium text-primary hover:underline">
                            Import sekarang →
                        </button>
                    }
                />
                <StepItem
                    number="4"
                    icon={<LuUsers size={18} />}
                    title="Siswa Tersimpan"
                    desc="Siswa langsung muncul di daftar Profil Siswa setelah import."
                />
            </div>

            {/* Kelas tersedia */}
            <div className="rounded-xl border border-netral-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                    <LuClipboardList size={15} className="text-netral-500" />
                    <p className="text-sm font-medium text-netral-700">Kelas yang tersedia</p>
                </div>

                {classes.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold">!</span>
                        Belum ada kelas.{" "}
                        <a href={route("class.index")} className="font-medium underline hover:text-amber-800">
                            Buat kelas terlebih dahulu
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {classes.map((c) => (
                            <span
                                key={c.id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-netral-200 bg-netral-50 px-3 py-1 text-xs font-medium text-netral-700"
                            >
                                <LuKeyRound size={10} className="text-primary" />
                                {c.class_name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function StepItem({
    number, icon, title, desc, action,
}: {
    number: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-netral-200 bg-white p-4 space-y-2">
            <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shrink-0">
                    {number}
                </div>
                <span className="text-primary">{icon}</span>
            </div>
            <p className="text-sm font-semibold text-netral-800">{title}</p>
            <p className="text-xs text-netral-500 leading-relaxed">{desc}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
