import { PageProps } from ".";

/* ---------- Shared sub-types ---------- */

interface BatchInstrument {
    id: string;
    name: "SDQ" | "SRQ";
}

interface BatchClass {
    id: string;
    class_name: string;
}

interface BatchSchool {
    id: string;
    name: string;
}

interface BatchPsychologist {
    id: string;
    name: string;
}

/* ---------- PinBatch ---------- */

interface PinBatch {
    id: string;
    label: string;
    status: "active" | "closed";
    expires_at: string | null;
    created_at: string;

    school_user_id: string;
    class_id: string;
    instrument_id: string;
    assigned_psychologist_id: string | null;

    class?: BatchClass;
    instrument?: BatchInstrument;
    school?: BatchSchool;
    assigned_psychologist?: BatchPsychologist;

    student_pins_count?: number;
    used_pins_count?: number;
}

/* ---------- StudentPin ---------- */

interface StudentPin {
    id: string;
    pin_code: string;
    batch_id: string;
    subject_id?: string;
    used_at: string | null;
    screening_id: string | null;
    created_at: string;

    batch?: PinBatch;
    subject?: {
        id: string;
        name: string;
        nis?: string;
        class_id?: string;
        class?: { id: string; class_name: string };
    };
    screening?: {
        id: string;
        status: string;
        date_taken: string;
        sdq_result?: {
            overall_category: string;
            total_difficulties: number;
            recommendation: string | null;
            date_analysis: string | null;
        };
    };
}

/* ---------- Pagination ---------- */

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

/* ---------- Page Props ---------- */

interface PinBatchIndexPageProps extends PageProps {
    batches: PaginatedResponse<PinBatch>;
}

interface PinBatchCreatePageProps extends PageProps {
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
}

interface PinBatchShowPageProps extends PageProps {
    batch: PinBatch;
    pins: StudentPin[];
    psychologists?: { id: string; name: string }[];
}

/* ---------- Student Dashboard Props ---------- */

interface StudentDashboardPageProps extends PageProps {
    active_pins: StudentPin[];
    screening_history: StudentScreeningHistory[];
}

interface StudentScreeningHistory {
    id: string;
    instrument_id: string;
    type_id: string;
    pin_id: string | null;
    date_taken: string;
    status: string;
    instrument?: BatchInstrument;
    sdq_result?: {
        id: string;
        overall_category: string;
        total_difficulties: number;
        recommendation: string | null;
        date_analysis: string | null;
    };
    student_pin?: {
        id: string;
        pin_code: string;
        batch?: { id: string; label: string };
    };
}

interface StudentResultPageProps extends PageProps {
    screening: StudentScreeningHistory & {
        instrument_type?: { id: string; type_name: string };
        sdq_result?: {
            id: string;
            emotional_score: number;
            conduct_score: number;
            hyperactivity_score: number;
            peer_score: number;
            prosocial_score: number;
            total_difficulties: number;
            overall_category: string;
            recommendation: string | null;
            date_analysis: string | null;
            psychologist?: { id: string; name: string };
        };
    };
}

export type {
    PinBatch,
    StudentPin,
    PaginatedResponse,
    PinBatchIndexPageProps,
    PinBatchCreatePageProps,
    PinBatchShowPageProps,
    StudentDashboardPageProps,
    StudentScreeningHistory,
    StudentResultPageProps,
};
