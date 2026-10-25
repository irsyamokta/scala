import { Head, useForm } from "@inertiajs/react";
import { LuKeyRound, LuIdCard } from "react-icons/lu";

import AppLayout from "@/Layouts/AppLayout";
import InputField from "@/shared/components/forms/InputField";
import Form from "@/shared/components/forms/Form";

export default function GuestScreeningIndex() {
    const { data, setData, post, processing, errors } = useForm({
        nis:      "",
        pin_code: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route("guest.screening.enter"));
    }

    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="Tes Skrining" />

            <div className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                            <LuKeyRound size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tes Skrining Siswa
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Masukkan NIS dan PIN yang diberikan oleh Guru BK
                            untuk memulai tes.
                        </p>
                    </div>

                    {/* Form */}
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

                            <div>
                                <InputField
                                    label="PIN"
                                    required
                                    placeholder="Contoh: AB12CD34"
                                    maxLength={8}
                                    value={data.pin_code}
                                    onChange={(e) =>
                                        setData(
                                            "pin_code",
                                            e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                                        )
                                    }
                                    className="text-center font-mono text-lg font-bold tracking-widest"
                                    error={errors.pin_code}
                                    hint="PIN 8 karakter huruf dan angka dari Guru BK"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    data.nis.length === 0 ||
                                    data.pin_code.length !== 8
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? "Memvalidasi..." : "Mulai Tes"}
                            </button>
                        </Form>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-400">
                        Hubungi Guru BK jika NIS atau PIN tidak dikenali.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
