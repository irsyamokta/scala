import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { ConfirmationDialog } from "@/shared/components/ui/ConfirmationDialog";
import Button from "@/shared/components/ui/button/Button";
import QuestionCard from "../../Parent/Screening/Components/card/QuestionCard";

import Illustration from "@assets/svg/img-submit.svg";

export default function StudentTest() {
    const { questions, instrument, subject, pin } = usePage().props as any;

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number | null>>({});

    const question = questions[current];

    const handleAnswer = (value: number) => {
        setAnswers({ ...answers, [question.id]: value });
    };

    const handleExit = async () => {
        const confirmed = await ConfirmationDialog({
            title: "Keluar dari Tes?",
            text: "Jawaban yang sudah diisi akan hilang. Yakin ingin keluar?",
            confirmButtonText: "Ya, Keluar",
            cancelButtonText: "Lanjutkan Tes",
        });
        if (!confirmed) return;
        router.visit(route("student.dashboard"));
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

            const payload = Object.entries(answers).map(([question_id, score]) => ({
                question_id,
                score,
            }));

            router.post(route("screening.pin.submit", pin.pin_code), {
                pin_code: pin.pin_code,
                answers: payload,
            });
        }
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const progress = Math.round(
        (Object.keys(answers).length / questions.length) * 100
    );

    return (
        <DashboardLayout title="Tes Skrining">
            <Head title="Tes Skrining" />

            <section>
                <div className="bg-netral-100 border border-gray-300 rounded-2xl p-6 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
                        <Button variant="danger" onClick={handleExit}>
                            Keluar Tes
                        </Button>

                        <div className="flex justify-between items-center bg-netral-200 py-3 px-4 rounded-lg md:flex-1">
                            <p className="text-sm text-netral-500">
                                Tes {instrument.name}
                            </p>
                            <p className="text-sm text-netral-600">
                                Pertanyaan {current + 1}/{questions.length}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-gray-200">
                        <div
                            className="h-1.5 rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Question */}
                    <QuestionCard
                        question={question.text}
                        options={question.options}
                        answer={answers[question.id] ?? null}
                        onAnswer={handleAnswer}
                    />

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            disabled={current === 0}
                            onClick={handlePrev}
                        >
                            Sebelumnya
                        </Button>

                        <Button
                            disabled={answers[question.id] == null}
                            onClick={handleNext}
                        >
                            {current === questions.length - 1 ? "Selesai" : "Selanjutnya"}
                        </Button>
                    </div>

                </div>
            </section>
        </DashboardLayout>
    );
}
