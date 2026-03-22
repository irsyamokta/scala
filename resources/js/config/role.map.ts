import type { MenuKey } from "./MenuRegistry";

export type Role =
    "superadmin"
    | "parent"
    | "school"
    | "general"
    | "psychologist";

export const ROLE_MENU: Record<
    Role,
    Record<string, MenuKey[]>
> = {
    superadmin: {
        main: ["dashboard", "test_screening", "instrument", "user"],
        other: ["profile"],
    },

    parent: {
        main: ["dashboard", "family", "test_screening"],
        other: ["profile"],
    },

    school: {
        main: ["dashboard", "student", "class", "test_screening"],
        other: ["school"],
    },

    general: {
        main: ["dashboard", "test_screening", "history"],
        other: ["profile"],
    },

    psychologist: {
        main: ["dashboard", "test_screening"],
        other: ["profile"],
    },
};
