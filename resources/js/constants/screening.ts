export const typeLabels: Record<string, string> = {
    parent_report: "Parent Report",
    teacher_report: "Teacher Report",
    youth_self_report: "Youth Self Report",
    self_report: "Self Report",
};

export const categoryColor: Record<string, any> = {
    Normal: "success",
    Borderline: "warning",
    Abnormal: "error",
    "Tidak Terindikasi": "success",
    Terindikasi: "error",
};

export const SDQ_RANGES = {
    parent_report: [
        { label: "Normal", range: "0 - 13" },
        { label: "Borderline", range: "14 - 16" },
        { label: "Abnormal", range: "17 - 40" },
    ],

    teacher_report: [
        { label: "Normal", range: "0 - 11" },
        { label: "Borderline", range: "12 - 15" },
        { label: "Abnormal", range: "16 - 40" },
    ],

    youth_self_report: [
        { label: "Normal", range: "0 - 15" },
        { label: "Borderline", range: "16 - 19" },
        { label: "Abnormal", range: "20 - 40" },
    ],
} as const;