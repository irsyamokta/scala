import Button from "@/Components/ui/button/Button";

interface Props {
    question: string;
    answer: number | null;
    onAnswer: (value: 0 | 1) => void;
}

export default function QuestionCard({ question, answer, onAnswer }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-center mb-8">{question}</h2>

            <Button
                size="lg"
                variant={answer === 1 ? "select" : "outline"}
                onClick={() => onAnswer(1)}
            >
                Ya
            </Button>

            <Button
                size="lg"
                variant={answer === 0 ? "select" : "outline"}
                onClick={() => onAnswer(0)}
            >
                Tidak
            </Button>

        </div>
    );
}
