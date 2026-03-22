import { PageProps } from ".";
import { Subject } from "./subject";

interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string;
    password: string;
    role: string;
    domicile: string;
    contact: string;
    objective?: string;
    school_name?: string;
    school_level?: string;
    school_address?: string;
    screening_scope?: string;
    self_subject?: {
        age: number | string;
        gender: string;
    } | null;

    subjects?: Subject[];

    onboarding_completed_at?: string;
    created_at?: string;
    updated_at?: string;
}

interface AuthProps {
    user: User;
}

interface PaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}

interface UserPageProps extends PageProps {
    auth: AuthProps;
    subject: Subject;
    users: PaginatedResponse<User>;
    filters: {
        search?: string
        roles?: string[]
        per_page?: number
    }
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

interface UserForm {
    name: string;
    email: string;
    contact: string;
    role: string;
    password: string;
}

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    subject?: Subject | null;
}

interface UserProfileForm {
    name: string;
    domicile: string;
    contact: string;
    age: string;
    gender: string;
}

interface UserProfileSchoolForm {
    school_name: string;
    school_level: string;
    school_address: string;
}

interface UserPasswordForm {
    current_password: string;
    password: string;
    password_confirmation: string;
}

interface UsersTableProps {
    users: PaginatedResponse<User>
    filters?: {
        search?: string
        roles?: string[]
        per_page?: number
    }
    setFilter?: (key: string, value: any) => void
    onView: (user: User) => void;
    onCreate: () => void
    onEdit: (user: User) => void
}

interface UserCardProps {
    user: User;
    subject?: Subject | null;
}

export type {
    User,
    AuthProps,
    UserModalProps,
    UserDetailModalProps,
    UserForm,
    UserProfileModalProps,
    UserProfileForm,
    UserProfileSchoolForm,
    UserPasswordForm,
    UserPageProps,
    UsersTableProps,
    UserCardProps
};
