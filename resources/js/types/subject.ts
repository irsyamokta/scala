import { PageProps } from ".";

interface PaginatedSubjects {
    data: Subject[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Subject {
    id: string;
    name: string;
    nis?: string;
    gender: string;
    age: string;
    tanggal_lahir?: string;
    owner_user_id: string;
    class_id?: string;
    class?: Class;
    is_self?: boolean;
    has_previous_screening: boolean;
    last_result?: string;
}

interface SubjectPageProps extends PageProps {
    subjects: Subject[];
    classes?: Class[];
    filters?: {
        search?: string;
        gender?: string[];
        class_id?: string[];
        per_page?: number;
    };
}

interface SchoolSubjectPageProps extends PageProps {
    subjects: PaginatedSubjects;
    classes: Class[];
    filters: {
        search?: string;
        gender?: string[];
        class_id?: string[];
        per_page?: number;
    };
}

interface SubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: Subject | null;
    classes?: Class[];
};

interface SubjectSelectedModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: Subject[];
    instrument: "SDQ" | "SRQ";
}

interface SubjectForm {
    name: string;
    nis?: string;
    gender: string;
    tanggal_lahir?: string;
    age?: string;              // dipakai role parent (input manual usia)
    class_id?: string;
    is_self?: boolean;
    has_previous_screening: boolean;
    last_result?: string;
};

interface SubjectCardProps {
    subjects: PaginatedSubjects | Subject[];
    classes?: Class[];
    filters: any;
    setFilter: any;
    onCreate: () => void;
    onEdit: (subject: Subject) => void;
}

interface Class {
    id: string;
    value: string;
    label: string;
    class_name: string;
    school_user_id: string;
    subjects_count: number
}

interface ClassPageProps extends PageProps {
    classes: Class[];
}

interface ClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes: Class | null;
};

interface ClassForm {
    class_name: string;
};

interface ClassCardProps {
    classes: Class[];
    onCreate: () => void;
    onEdit: (classes: Class) => void;
}

export type {
    Subject,
    PaginatedSubjects,
    SubjectPageProps,
    SchoolSubjectPageProps,
    SubjectModalProps,
    SubjectSelectedModalProps,
    SubjectForm,
    SubjectCardProps,
    Class,
    ClassPageProps,
    ClassModalProps,
    ClassForm,
    ClassCardProps
}
