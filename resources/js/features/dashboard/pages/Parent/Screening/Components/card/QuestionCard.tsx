import Button from "@/shared/components/ui/button/Button";

interface Option {
    label: string;
    score: number;
}

interface Props {
    question: string;
    options: Option[] | string;
    answer: number | null;
    onAnswer: (value: number) => void;
}

export default function QuestionCard({
    question,
    options,
    answer,
    onAnswer
}: Props) {

    const parsedOptions: Option[] =
        typeof options === "string"
            ? JSON.parse(options)
            : options;

    return (
        <div className="flex flex-col gap-4">

            <h2 className="text-netral-900 font-medium text-center mb-8">
                {question}
            </h2>

            {parsedOptions.map((opt) => (
                <Button
                    key={opt.score}
                    size="lg"
                    variant={answer === opt.score ? "select" : "outline"}
                    onClick={() => onAnswer(opt.score)}
                    className="font-normal"
                >
                    {opt.label}
                </Button>
            ))}

        </div>
    );
}