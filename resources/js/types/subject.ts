import { PageProps } from ".";

interface Subject {
    id: string;
    name: string;
    gender: string;
    age: string;
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
    filters: {
        search: string;
        gender: [];
        class_id?: []
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
    gender: string;
    age: string;
    class_id?: string;
    is_self?: boolean;
    has_previous_screening: boolean;
    last_result?: string;
};

interface SubjectCardProps {
    subjects: Subject[];
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
    SubjectPageProps,
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
