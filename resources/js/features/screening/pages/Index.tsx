import { Head, useForm, usePage } from "@inertiajs/react";
import { LuCalendar, LuIdCard } from "react-icons/lu";

import InputField from "@/shared/components/forms/InputField";
import Form from "@/shared/components/forms/Form";
import { PageProps } from "@/types";

interface BatchInfo {
    token: string;
    label: string;
    instrument: string;
    expires_at: string | null;
}

type GuestScreeningPageProps = PageProps<{ batch: BatchInfo }>;

/** Konversi DD/MM/YYYY → YYYY-MM-DD untuk dikirim ke backend. */
function toIsoDate(dmy: string): string {
    const [d, m, y] = dmy.split("/");
    if (!d || !m || !y || y.length < 4) return "";
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

/** Format input otomatis: tambah / setelah DD dan MM. */
function formatDmy(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function GuestScreeningIndex() {
    const { batch } = usePage<GuestScreeningPageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        nis: "",
        tanggal_lahir: "",      // YYYY-MM-DD — dikirim ke backend
        tanggal_lahir_display: "", // DD/MM/YYYY — ditampilkan ke user
    });

    function handleTanggalLahir(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatDmy(e.target.value);
        const iso = toIsoDate(formatted);
        setData({
            ...data,
            tanggal_lahir_display: formatted,
            tanggal_lahir: iso,
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route("guest.screening.enter", batch.token));
    }

    const isDateComplete = data.tanggal_lahir_display.length === 10;

    return (
        <>
            <Head title="Tes Skrining" />

            <div className="flex items-center justify-center px-4 min-h-screen bg-gray-50">
                <div className="w-full max-w-md py-12">

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {batch.label}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Masukkan NIS dan tanggal lahir untuk memulai tes{" "}
                            <span className="font-medium">{batch.instrument}</span>.
                        </p>
                        {batch.expires_at && (
                            <p className="mt-1 text-xs text-gray-400">
                                Berlaku hingga{" "}
                                {new Date(batch.expires_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <Form id="guest-screening-form" onSubmit={handleSubmit} className="space-y-5">

                            <InputField
                                label="NIS (Nomor Induk Siswa)"
                                required
                                placeholder="Masukkan NIS Anda"
                                startIcon={<LuIdCard size={16} />}
                                inputMode="numeric"
                                value={data.nis}
                                onChange={(e) =>
                                    setData("nis", e.target.value.replace(/[^0-9]/g, "").trim())
                                }
                                error={errors.nis}
                            />

                            <InputField
                                label="Tanggal Lahir"
                                required
                                placeholder="DD/MM/YYYY"
                                startIcon={<LuCalendar size={16} />}
                                inputMode="numeric"
                                value={data.tanggal_lahir_display}
                                onChange={handleTanggalLahir}
                                error={errors.tanggal_lahir}
                                hint="Contoh: 15/08/2008"
                            />

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    data.nis.length === 0 ||
                                    !isDateComplete
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? "Memvalidasi..." : "Mulai Tes"}
                            </button>
                        </Form>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-400">
                        Hubungi Guru BK jika NIS atau tanggal lahir tidak dikenali.
                    </p>
                </div>
            </div>
        </>
    );
}
