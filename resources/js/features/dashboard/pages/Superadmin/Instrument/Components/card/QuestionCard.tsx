import { QuestionCardProps } from "@/types/instrument"

import { SDQ_DOMAINS } from "@/shared/constants/instrument"

import TextArea from "@/shared/components/forms/TextArea"
import Select from "@/shared/components/forms/Select"
import Switch from "@/shared/components/forms/Switch"
import Button from "@/shared/components/ui/button/Button"

import { FiTrash2 } from "react-icons/fi"

export default function QuestionCard({
    index,
    question,
    showDomain,
    showReverse,
    error,
    onChange,
    onDelete
}: QuestionCardProps) {

    return (
        <div className="bg-netral-100 p-4 rounded-xl border border-netral-300">

            {/* Header */}
            <div className="flex justify-between mb-4">
                <h2 className="font-semibold">
                    Pertanyaan {index + 1}
                </h2>

                {/* {onDelete && (
                    <Button
                        variant="danger"
                        startIcon={<FiTrash2 />}
                        onClick={onDelete}
                    >
                        Hapus
                    </Button>
                )} */}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full flex flex-col gap-3">

                    {/* Question */}
                    <TextArea
                        value={question.text}
                        placeholder="Masukkan pertanyaan"
                        onChange={(v: string) => onChange("text", v)}
                        error={error?.text}
                        disabled
                    />

                    {/* Reverse Score */}
                    {showReverse && (
                        <Switch
                            label="Reverse Score"
                            startLabel
                            checked={question.is_reverse_scored || false}
                            onChange={(v: boolean) =>
                                onChange("is_reverse_scored", v)
                            }
                            disabled
                        />
                    )}
                </div>

                {/* Domain */}
                {showDomain && (
                    <Select
                        value={question.domain || ""}
                        placeholder="Pilih domain"
                        onChange={(v) => onChange("domain", v as string)}
                        className="w-full md:max-w-3xs"
                        disabled
                        options={SDQ_DOMAINS}
                        error={error?.domain}
                    />
                )}

            </div>
        </div>
    )
}
