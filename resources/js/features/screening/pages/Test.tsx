import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { LuCircleAlert, LuClock, LuClipboardList, LuArrowRight } from "react-icons/lu";

import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import Button from "@/shared/components/ui/button/Button";
import QuestionCard from "../../dashboard/pages/Parent/Screening/Components/card/QuestionCard";

import Illustration from "@assets/svg/img-submit.svg";

export default function GuestTest() {
    const { questions, instrument, subject, batch } = usePage().props as any;

    const [hasStarted, setHasStarted] = useState(false);
    const [current, setCurrent]       = useState(0);
    const [answers, setAnswers]       = useState<Record<string, number | null>>({});
    const [submitting, setSubmitting] = useState(false);

    const question  = questions[current];
    const progress  = submitting
        ? 100
        : Math.round((current / questions.length) * 100);

    const handleAnswer = (value: number) => {
        setAnswers({ ...answers, [question.id]: value });
    };

    const handleNext = async () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            const confirmed = await ConfirmationDialog({
                title: "Selesaikan Tes?",
                text: "Pastikan semua jawaban sudah benar sebelum mengirim.",
                imageUrl: Illustration,
                confirmButtonText: "Ya, Selesaikan",
                cancelButtonText: "Cek Lagi",
                reverseButtons: true,
            });
            if (!confirmed) return;

            setSubmitting(true);
            const payload = Object.entries(answers).map(([question_id, score]) => ({
                question_id,
                score,
            }));
            router.post(
                route("guest.screening.submit", batch.token),
                { batch_id: batch.id, answers: payload },
                { onFinish: () => setSubmitting(false) }
            );
        }
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    return (
        <>
            <Head title={`Tes ${instrument.name}`} />

            <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12 flex flex-col justify-center">
                {!hasStarted ? (
                    <div className="mx-auto w-full max-w-2xl">
                        {/* Header Info Siswa & Tes */}
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {subject.name}
                            </h1>
                            <p className="mt-1 text-sm font-semibold text-primary">
                                Tes {instrument.name}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Silakan baca cara pengerjaan dan informasi penting berikut sebelum memulai.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Card Cara Pengerjaan */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-2.5 text-primary">
                                    <LuClipboardList size={20} />
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Cara Pengerjaan
                                    </h2>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            1
                                        </span>
                                        <span>Baca setiap pertanyaan dengan seksama sebelum menjawab.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            2
                                        </span>
                                        <span>Pilih jawaban yang paling sesuai dengan kondisimu.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            3
                                        </span>
                                        <span>
                                            Klik tombol <span className="font-semibold text-gray-800">Selanjutnya</span> untuk lanjut ke pertanyaan berikutnya.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            4
                                        </span>
                                        <span>
                                            Kamu bisa kembali ke pertanyaan sebelumnya dengan tombol <span className="font-semibold text-gray-800">Sebelumnya</span>.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            5
                                        </span>
                                        <span>
                                            Klik <span className="font-semibold text-gray-800">Selesai</span> di pertanyaan terakhir untuk mengirim jawaban.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Periode Waktu */}
                                <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 space-y-2">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <LuClock size={18} />
                                        <h3 className="text-sm font-semibold">Periode Penilaian</h3>
                                    </div>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Jawab berdasarkan apa yang kamu rasakan dan alami dalam{" "}
                                        <span className="font-semibold">6 bulan terakhir</span>, bukan hanya hari ini saja.
                                    </p>
                                </div>

                                {/* Peringatan */}
                                <div className="rounded-2xl border border-orange-100 bg-orange-50/80 p-5 space-y-2">
                                    <div className="flex items-center gap-2 text-orange-700">
                                        <LuCircleAlert size={18} />
                                        <h3 className="text-sm font-semibold">Perhatian</h3>
                                    </div>
                                    <p className="text-xs text-orange-700 leading-relaxed">
                                        <span className="font-semibold">Jangan tutup atau refresh halaman ini</span> sebelum tes selesai. Jawaban yang sudah diisi akan hilang.
                                    </p>
                                </div>
                            </div>

                            {/* Tombol Selanjutnya / Mulai */}
                            <div className="pt-2">
                                <Button
                                    size="lg"
                                    fullWidth
                                    endIcon={<LuArrowRight size={18} />}
                                    onClick={() => setHasStarted(true)}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-2xl">
                        {/* Header Info Siswa & Tes */}
                        <div className="mb-6 text-center">
                            <h2 className="text-lg font-bold text-gray-900">{subject.name}</h2>
                            <p className="text-xs font-medium text-gray-400">Tes {instrument.name}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                                <span>Pertanyaan {current + 1} dari {questions.length}</span>
                                <span>{progress}% selesai</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className="h-2 rounded-full bg-primary transition-[width] duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Card Soal Bersih & Terfokus */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                            <QuestionCard
                                question={question.text}
                                options={question.options}
                                answer={answers[question.id] ?? null}
                                onAnswer={handleAnswer}
                            />

                            <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-8">
                                <Button
                                    variant="outline"
                                    disabled={current === 0}
                                    onClick={handlePrev}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    disabled={answers[question.id] == null || submitting}
                                    onClick={handleNext}
                                >
                                    {submitting
                                        ? "Mengirim..."
                                        : current === questions.length - 1
                                            ? "Selesai"
                                            : "Selanjutnya"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
