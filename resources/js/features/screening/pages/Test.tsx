import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { LuCircleAlert, LuClock, LuClipboardList } from "react-icons/lu";

import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import Button from "@/shared/components/ui/button/Button";
import QuestionCard from "../../dashboard/pages/Parent/Screening/Components/card/QuestionCard";

import Illustration from "@assets/svg/img-submit.svg";

export default function GuestTest() {
    const { questions, instrument, subject, batch } = usePage().props as any;

    const [current, setCurrent]       = useState(0);
    const [answers, setAnswers]       = useState<Record<string, number | null>>({});
    const [submitting, setSubmitting] = useState(false);

    const question  = questions[current];
    const answered  = Object.keys(answers).length;
    const progress  = Math.round((answered / questions.length) * 100);

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
            <Head title="Tes Skrining" />

            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-5xl">

                    {/* Info siswa */}
                    <div className="mb-6 text-center">
                        <p className="text-base font-semibold text-gray-800">{subject.name}</p>
                        <p className="text-sm text-gray-400">Tes {instrument.name}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                            <span>Pertanyaan {current + 1} dari {questions.length}</span>
                            <span>{progress}% selesai</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Layout dua kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

                        {/* Kolom kiri — panduan */}
                        <div className="space-y-4">

                            {/* Cara pengerjaan */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <LuClipboardList size={18} />
                                    <p className="text-sm font-semibold">Cara Pengerjaan</p>
                                </div>
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">1</span>
                                        <span>Baca setiap pertanyaan dengan seksama sebelum menjawab.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">2</span>
                                        <span>Pilih jawaban yang paling sesuai dengan kondisimu.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">3</span>
                                        <span>Klik tombol <span className="font-semibold text-gray-800">Selanjutnya</span> untuk lanjut ke pertanyaan berikutnya.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">4</span>
                                        <span>Kamu bisa kembali ke pertanyaan sebelumnya dengan tombol <span className="font-semibold text-gray-800">Sebelumnya</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">5</span>
                                        <span>Klik <span className="font-semibold text-gray-800">Selesai</span> di pertanyaan terakhir untuk mengirim jawaban.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Periode waktu */}
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 space-y-2">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <LuClock size={16} />
                                    <p className="text-sm font-semibold">Periode Penilaian</p>
                                </div>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Jawab berdasarkan apa yang kamu rasakan dan alami dalam <span className="font-semibold">6 bulan terakhir</span>, bukan hanya hari ini saja.
                                </p>
                            </div>

                            {/* Peringatan jangan tutup */}
                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 space-y-2">
                                <div className="flex items-center gap-2 text-orange-700">
                                    <LuCircleAlert size={16} />
                                    <p className="text-sm font-semibold">Perhatian</p>
                                </div>
                                <p className="text-xs text-orange-700 leading-relaxed">
                                    <span className="font-semibold">Jangan tutup atau refresh halaman ini</span> sebelum tes selesai. Jawaban yang sudah diisi akan hilang dan tidak bisa dilanjutkan.
                                </p>
                            </div>
                        </div>

                        {/* Kolom kanan — soal */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                            <QuestionCard
                                question={question.text}
                                options={question.options}
                                answer={answers[question.id] ?? null}
                                onAnswer={handleAnswer}
                            />

                            <div className="flex justify-between pt-6">
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
                </div>
            </div>
        </>
    );
}
