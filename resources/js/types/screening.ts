import { PageProps } from ".";

type ScreeningCategory =
    | "Normal"
    | "Borderline"
    | "Abnormal"
    | "Terindikasi"
    | "Tidak Terindikasi";

type InstrumentName = "SDQ" | "SRQ";

type InstrumentTypeName =
    | "parent_report"
    | "teacher_report"
    | "youth_self_report"
    | "self_report";

/* ---------- Pagination ---------- */

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

/* ---------- Shared objects ---------- */

interface UserInfo {
    id: string;
    name: string;
    role?: string;
}

interface SubjectInfo {
    id: string;
    name: string;
    age?: number;
}

interface InstrumentInfo {
    id: string;
    name: InstrumentName;
}

interface InstrumentTypeInfo {
    id: string;
    type_name: InstrumentTypeName;
}

/* ---------- Results ---------- */

interface SdqResult {
    id: string;

    psychologist?: UserInfo;

    emotional_score: number;
    emotional_note?: string;

    conduct_score: number;
    conduct_note?: string;

    hyperactivity_score: number;
    hyperactivity_note?: string;

    peer_score: number;
    peer_note?: string;

    prosocial_score: number;
    prosocial_note?: string;

    total_difficulties: number;

    overall_category: ScreeningCategory;

    recommendation?: string;

    date_analysis: string;

    created_at: string;
}

interface SrqResult {
    id: string;

    psychologist?: UserInfo;

    gme_score: number;
    gme_indication: boolean;
    gme_note?: string;

    substance_use_indication: boolean;
    substance_use_note?: string;

    psychotic_symptom_indication: boolean;
    psychotic_symptom_note?: string;

    ptsd_symptom_indication: boolean;
    ptsd_symptom_note?: string;

    psychologist_note?: string;

    recommendation?: string;

    date_analysis: string;

    created_at: string;
}

/* ---------- Screening ---------- */

interface ScreeningResult {
    id: string;

    subject: SubjectInfo;
    reporter: UserInfo;

    instrument: InstrumentInfo;
    instrument_type: InstrumentTypeInfo;

    sdq_result?: SdqResult;
    srq_result?: SrqResult;

    date_taken: string;
    status: string;

    created_at?: string;
    updated_at?: string;
}

/* ---------- Screening Notes ---------- */

interface ScreeningNoteForm {

    // SDQ
    emotional_note?: string
    conduct_note?: string
    hyperactivity_note?: string
    peer_note?: string
    prosocial_note?: string

    // SRQ
    gme_note?: string
    substance_use_note?: string
    psychotic_symptom_note?: string
    ptsd_symptom_note?: string
    psychologist_note?: string

    // General
    recommendation?: string
}

/* ---------- Component Props ---------- */

interface ScreeningDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    screening: ScreeningResult | null;
}

interface ScreeningsTableProps {
    screenings: PaginatedResponse<ScreeningResult>;

    filters?: {
        search?: string;
        category?: string[];
        per_page?: number;
    };

    onView: (screening: ScreeningResult) => void;
    setFilter?: (key: string, value: any) => void;
}

interface PsychologistScreeningItem {
    name: string;
    instrument: string;
    type: string;
    date: string;
    status: string;
}

interface PsychologistScreeningTableProps {
    data: PsychologistScreeningItem[];
}

/* ---------- Page Props ---------- */

interface ScreeningPageProps extends PageProps {
    screenings: PaginatedResponse<ScreeningResult>;
    filters: {
        search?: string;
        category?: string[];
        per_page?: number;
    };
}

export type {
    ScreeningResult,
    ScreeningDetailModalProps,
    ScreeningsTableProps,
    PsychologistScreeningItem,
    PsychologistScreeningTableProps,
    SdqResult,
    SrqResult,
    ScreeningNoteForm,
    ScreeningPageProps,
    PaginatedResponse,
};
