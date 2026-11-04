import type { MenuKey } from "./MenuRegistry";

export type Role =
    "superadmin"
    | "parent"
    | "school"
    | "general"
    | "psychologist"
    | "student";

export const ROLE_MENU: Record<
    Role,
    Record<string, MenuKey[]>
> = {
    superadmin: {
        main: ["dashboard", "screening_results", "admin_batch", "instrument", "user"],
        other: ["profile"],
    },

    parent: {
        main: ["dashboard", "family", "test_screening"],
        other: ["profile"],
    },

    school: {
        main: ["dashboard", "student", "class", "test_screening", "batch_skrining"],
        other: ["school"],
    },

    general: {
        main: ["dashboard", "test_screening", "history"],
        other: ["profile"],
    },

    psychologist: {
        main: ["dashboard", "screening_results", "batch_assigned"],
        other: ["profile"],
    },

    student: {
        main: ["student_dashboard"],
        other: [],
    },
};
