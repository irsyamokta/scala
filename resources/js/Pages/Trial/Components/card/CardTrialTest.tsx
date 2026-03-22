import { useState } from "react";
import { Link, router } from "@inertiajs/react";

import { QUESTIONS } from "@/data/questionSrq";
import { calculateSRQ } from "@/utils/srqLogic";

import QuestionCard from "./CardQuestion";
import Button from "@/Components/ui/button/Button";
import { ConfirmationDialog } from "@/Components/ConfirmationDialog";

export default function CardTrialTest() {
    const [current, setCurrent] = useState(0);

    const [answers, setAnswers] = useState<(0 | 1 | null)[]>(
        Array(QUESTIONS.length).fill(null)
    );

    const handleAnswer = (value: 0 | 1) => {
        const updated = [...answers];
        updated[current] = value;
        setAnswers(updated);
    };

    const handleExit = async () => {
        const confirmed = await ConfirmationDialog({
            title: "Keluar dari Tes?",
            text: "Jawaban yang sudah diisi bisa hilang. Yakin ingin keluar?",
            confirmButtonText: "Ya, Keluar",
            cancelButtonText: "Lanjutkan Tes",
        });

        if (!confirmed) return;

        router.visit(route("trial.index"));
    };

    const handleNext = () => {
        if (current < QUESTIONS.length - 1) {
            setCurrent(current + 1);
        } else {
            const result = calculateSRQ(answers);

            localStorage.setItem("srq_result", JSON.stringify(result));
            router.visit("/srq-test/hasil");
        }
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const question = QUESTIONS[current];

    return (
        <section className="max-w-4xl mx-auto px-6 lg:px-20 py-12">
            <div
                data-aos="fade-up"
                className="border rounded-2xl p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-3 mb-12">
                    
                    <Button variant="danger"  onClick={handleExit}>
                        Keluar Tes
                    </Button>

                    <div className="flex justify-between items-center bg-netral-200 py-3 px-4 md:py-0 rounded-lg md:flex-1">
                        <p className="text-sm text-netral-500">Preview Tes SRQ-29</p>
                        <p className="text-sm text-netral-600">Pertanyaan {current + 1}/{QUESTIONS.length}</p>
                    </div>
                </div>

                <QuestionCard
                    question={question.question}
                    answer={answers[current]}
                    onAnswer={handleAnswer}
                />

                <div className="flex justify-between pt-4">

                    <Button
                        variant="outline"
                        disabled={current === 0}
                        onClick={handlePrev}
                    >
                        Sebelumnya
                    </Button>

                    <Button
                        disabled={answers[current] === null}
                        onClick={handleNext}
                    >
                        {current === QUESTIONS.length - 1
                            ? "Selesai"
                            : "Selanjutnya"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
