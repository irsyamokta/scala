import { PageProps } from ".";
import { Class } from "./subject";

/* ---------- Import Result Row ---------- */

interface ImportSuccessRow {
    row: number;
    name: string;
    nis?: string;
    class: string;
    is_new: boolean;
}

interface ImportFailureRow {
    row: number;
    name: string;
    errors: string[];
}

interface ImportResult {
    success_count: number;
    failure_count: number;
    successes: ImportSuccessRow[];
    failures: ImportFailureRow[];
}

/* ---------- Page Props ---------- */

interface StudentImportPageProps extends PageProps {
    classes: Class[];
}

interface StudentImportResultPageProps extends PageProps {
    result: ImportResult;
}

export type {
    ImportSuccessRow,
    ImportFailureRow,
    ImportResult,
    StudentImportPageProps,
    StudentImportResultPageProps,
};
