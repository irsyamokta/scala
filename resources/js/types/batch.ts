import { PageProps } from ".";

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
    school_name: string | null;
}

interface BatchPsychologist {
    id: string;
    name: string;
}

interface Batch {
    id: string;
    label: string;
    access_token: string;
    status: "active" | "closed";
    expires_at: string | null;
    created_at: string;

    school_user_id: string;
    class_id: string | null;
    instrument_id: string;
    assigned_psychologist_id: string | null;

    class?: BatchClass;
    instrument?: BatchInstrument;
    school?: BatchSchool;
    assigned_psychologist?: BatchPsychologist;

    total_subjects?: number;
    tested_count?: number;
}

/** Catatan partisipasi siswa dalam batch (satu record per siswa yang sudah tes). */
interface BatchParticipant {
    id: string;
    batch_id: string;
    subject_id: string;
    used_at: string;
    screening_id: string | null;

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
        srq_result?: {
            id: string;
        };
    };
}

/** Data siswa dalam kelas batch beserta status tesnya. */
interface BatchSubject {
    id: string;
    name: string;
    nis?: string;
    age: number;
    class?: { id: string; class_name: string };
    batch_entries: BatchParticipant[];
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface BatchIndexPageProps extends PageProps {
    batches: PaginatedResponse<Batch>;
}

interface BatchShowPageProps extends PageProps {
    batch: Batch;
    participants: BatchSubject[];
    psychologists?: { id: string; name: string }[];
    screening_url: string;
    qr_code_svg: string;
    back_route: string;
}

interface StudentDashboardPageProps extends PageProps {
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
    Batch,
    BatchParticipant,
    BatchSubject,
    PaginatedResponse,
    BatchIndexPageProps,
    BatchShowPageProps,
    StudentDashboardPageProps,
    StudentScreeningHistory,
    StudentResultPageProps,
};
