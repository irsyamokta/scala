import { useEffect, useMemo, useCallback } from "react"
import { useForm, router } from "@inertiajs/react"
import { toast } from "sonner"

import usePersistentState from "@/shared/hooks/usePersistentState"

import {
    Instrument,
    InstrumentFormData,
    InstrumentTypeForm,
    QuestionForm
} from "@/types/instrument"

import QuestionCard from "../Components/card/QuestionCard"
import Tabs from "../Components/tab/Tabs"
import Button from "@/shared/components/ui/button/Button"

import { LuFilePlus } from "react-icons/lu"
import { MdOutlineDone } from "react-icons/md"

import { INSTRUMENT_CONFIG } from "@/shared/constants/instrument"

interface Props {
    instrument: Instrument
}

export default function InstrumentFormBuilder({ instrument }: Props) {
    const config = INSTRUMENT_CONFIG[instrument?.name || "SDQ"]

    const [activeTypeIndex, setActiveTypeIndex] = usePersistentState<number>(
        `instrument_tab_${instrument?.name || "new"}`,
        0
    )

    const initialTypes: InstrumentTypeForm[] = useMemo(() =>
        config.types.map((type, idx) => {
            const existing = instrument?.instrument_types?.find(t => t.type_name === type.key)
            return {
                type_name: type.key,
                min_age: type.min,
                max_age: type.max,
                is_baseline: existing?.is_baseline ?? false,
                questions: existing?.questions?.map(q => ({
                    id: q.id,
                    question_number: q.question_number ?? idx + 1,
                    text: q.text,
                    domain: q.domain ?? "",
                    is_reverse_scored: q.is_reverse_scored ?? false,
                })) ?? []
            }
        }),
        [instrument, config])

    const { data, setData, post, put, processing, errors } = useForm<InstrumentFormData>({
        name: instrument?.name || "SDQ",
        types: initialTypes,
    })

    useEffect(() => {
        setData(prev => ({
            ...prev,
            types: initialTypes
        }))
    }, [initialTypes])

    const currentType = data.types[activeTypeIndex]

    const currentTabHasValidQuestion = useMemo(() =>
        currentType.questions.some(q => (q.text || "").trim() !== ""),
        [currentType.questions])

    const updateQuestion = useCallback(<K extends keyof QuestionForm>(
        qIndex: number,
        field: K,
        value: QuestionForm[K]
    ) => {
        setData(prev => {
            const newTypes = [...prev.types]
            newTypes[activeTypeIndex] = {
                ...newTypes[activeTypeIndex],
                questions: newTypes[activeTypeIndex].questions.map((q, i) =>
                    i === qIndex ? { ...q, [field]: value } : q
                )
            }
            return { ...prev, types: newTypes }
        })
    }, [setData, activeTypeIndex])

    const addQuestion = useCallback(() => {
        setData(prev => {
            const newTypes = [...prev.types]
            newTypes[activeTypeIndex] = {
                ...newTypes[activeTypeIndex],
                questions: [
                    ...newTypes[activeTypeIndex].questions,
                    { question_number: newTypes[activeTypeIndex].questions.length + 1, text: "", domain: "", is_reverse_scored: false }
                ]
            }
            return { ...prev, types: newTypes }
        })
    }, [setData, activeTypeIndex])

    const removeQuestion = useCallback((questionId?: string) => {

        const question = currentType.questions.find(q => q.id === questionId)

        if (!question?.id) {
            setData(prev => ({
                ...prev,
                types: prev.types.map((t, i) =>
                    i === activeTypeIndex
                        ? { ...t, questions: t.questions.filter(q => q.id !== questionId) }
                        : t
                )
            }))
            return
        }

        router.delete(route("instrument.question.destroy", question.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Pertanyaan berhasil dihapus")

                setData(prev => ({
                    ...prev,
                    types: prev.types.map((t, i) =>
                        i === activeTypeIndex
                            ? { ...t, questions: t.questions.filter(q => q.id !== questionId) }
                            : t
                    )
                }))
            }
        })

    }, [currentType.questions, activeTypeIndex])

    const handleSubmit = () => {
        const activeConfig = config.types[activeTypeIndex]
        const activeTypeData = data.types[activeTypeIndex]

        const validQuestions = activeTypeData.questions
            .filter(q => (q.text || "").trim() !== "")
            .map(q => ({
                text: q.text.trim(),
                domain: q.domain ?? "",
                is_reverse_scored: !!q.is_reverse_scored,
            }))

        if (validQuestions.length === 0) {
            toast.error("Minimal satu pertanyaan harus diisi di tab ini")
            return
        }

        const isEdit = !!instrument?.id
        const method = isEdit ? put : post
        const routeName = isEdit ? "instrument.update" : "instrument.store"
        const routeParams = isEdit ? instrument.id : undefined

        method(route(routeName, routeParams), {
            // @ts-ignore
            transform: () => ({
                name: data.name,
                types: [{
                    type_name: activeConfig.key,
                    min_age: activeConfig.min,
                    max_age: activeConfig.max,
                    is_baseline: activeTypeData.is_baseline ?? false,
                    questions: validQuestions,
                }],
            }),
            onError: (errs) => {
                const msg = Object.values(errs)[0] as string | undefined
                toast.error(msg || "Validasi gagal, periksa input")
            },
            onSuccess: () => {
                toast.success(`Instrument ${activeConfig.key.replaceAll("_", " ")} berhasil disimpan!`)
            },
            preserveScroll: true,
            preserveState: true,
        })
    }

    return (
        <div className="space-y-6">
            {config.types.length > 1 && (
                <Tabs
                    active={activeTypeIndex}
                    onChange={setActiveTypeIndex}
                    tabs={config.types.map((type, i) => ({
                        label: type.key.replaceAll("_", " "),
                        value: i,
                    }))}
                />
            )}

            <div className="space-y-4">
                {currentType.questions.map((question, qIndex) => {
                    const errorText = errors[`types.0.questions.${qIndex}.text`]
                    const errorDomain = errors[`types.0.questions.${qIndex}.domain`]

                    return (
                        <QuestionCard
                            key={qIndex}
                            index={qIndex}
                            question={question}
                            showDomain={config.hasDomain}
                            showReverse={config.hasReverse}
                            error={{ text: errorText, domain: errorDomain }}
                            onChange={(field, value) => updateQuestion(qIndex, field, value)}
                            onDelete={() => removeQuestion(question.id)}
                        />
                    )
                })}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                {/* <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    startIcon={<LuFilePlus />}
                    onClick={addQuestion}
                >
                    Tambah Pertanyaan
                </Button> */}

                {/* <Button
                    size="lg"
                    className="sm:w-1/2"
                    onClick={handleSubmit}
                    startIcon={<MdOutlineDone />}
                    disabled={processing || !currentTabHasValidQuestion}
                >
                    Simpan
                </Button> */}
            </div>
        </div>
    )
}
