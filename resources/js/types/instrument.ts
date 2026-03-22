import { PageProps } from "."

export type InstrumentName = "SDQ" | "SRQ"

export interface InstrumentTypeConfig {
    key: string
    min: number
    max: number
}

export interface InstrumentConfig {
    types: InstrumentTypeConfig[]
    hasDomain: boolean
    hasReverse: boolean
}

export interface QuestionForm {
    id?: string
    question_number?: number
    text: string
    domain?: string
    is_reverse_scored?: boolean
}

export interface InstrumentTypeForm {
    type_name: string
    min_age?: number
    max_age?: number
    is_baseline?: boolean
    questions: QuestionForm[]
}

export interface InstrumentFormData {
    name: InstrumentName
    types: InstrumentTypeForm[]
}

export interface QuestionCardProps {
    index: number
    question: QuestionForm

    showDomain?: boolean
    showReverse?: boolean

    error?: {
        text?: string
        domain?: string
    }

    onChange: <K extends keyof QuestionForm>(
        field: K,
        value: QuestionForm[K]
    ) => void
    onDelete?: () => void
}

export interface InstrumentQuestion {
    id: string
    instrument_id: string
    type_id: string

    question_number: number
    text: string
    domain: string | null
    is_reverse_scored: boolean

    created_at: string
    updated_at: string
}

export interface InstrumentType {
    id: string
    instrument_id: string

    type_name: string
    is_baseline: boolean

    questions: InstrumentQuestion[]

    created_at: string
    updated_at: string
}

export interface Instrument {
    id: string
    name: InstrumentName

    min_age?: number
    max_age?: number

    instrument_types: InstrumentType[]

    created_at?: string
    updated_at?: string
}

export interface InstrumentPageProps extends PageProps {
    instruments: Instrument[]
}
