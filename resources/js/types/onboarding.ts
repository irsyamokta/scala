import { PageProps } from ".";
import { User } from "./user";
import { Subject } from "./subject";

interface NextProps {
    step: number;
    onNext: () => void;
    onPrev?: () => void;
}

interface OnboardingPageProps extends PageProps {
    user: User;
    subject: Subject;
    selfSubject?: Subject;
}

interface OnboardingRoleForm {
    role: string;
}

interface OnboardingBasicInfoForm {
    name: string;
    age?: string;
    gender?: string;
    domicile: string;
    contact: string;
    objective: string;
    school_name?: string;
    school_level?: string;
    school_address?: string;
}

interface OnboardingSubjectForm {
    name?: string;
    gender?: string;
    age?: string;
    owner_user_id?: string;
    class_id?: string;
    is_self?: boolean;
    has_previous_screening: boolean;
    last_result?: string;
}

interface OnboardingSchoolForm {
    school_name: string;
    school_level: string;
    school_address: string;
    screening_scope: string;
}

interface OnboardingConfirmedForm {
    onboarding_completed_at: boolean;
}

export type {
    NextProps,
    OnboardingPageProps,
    OnboardingRoleForm,
    OnboardingBasicInfoForm,
    OnboardingSubjectForm,
    OnboardingConfirmedForm,
    OnboardingSchoolForm,
}
