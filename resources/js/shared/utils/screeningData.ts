import { ScreeningResult, ScreeningNoteForm, SdqResult, SrqResult } from "@/types/screening";

export type DetailRow = {
    aspect: string;
    result: string;
    interpretation: string;
    noteField?: keyof ScreeningNoteForm;
};

type SdqCategory = "normal" | "borderline" | "abnormal";

type DomainThreshold = {
    normal: [number, number];
    borderline: [number, number];
    abnormal: [number, number];
};

type InstrumentThresholds = {
    emotional: DomainThreshold;
    conduct: DomainThreshold;
    hyperactivity: DomainThreshold;
    peer: DomainThreshold;
    prosocial: DomainThreshold;
    total: DomainThreshold;
};

const THRESHOLDS: Record<string, InstrumentThresholds> = {
    parent_report: {
        emotional:    { normal: [0, 3],  borderline: [4, 4],  abnormal: [5, 10] },
        conduct:      { normal: [0, 2],  borderline: [3, 3],  abnormal: [4, 10] },
        hyperactivity:{ normal: [0, 5],  borderline: [6, 6],  abnormal: [7, 10] },
        peer:         { normal: [0, 2],  borderline: [3, 3],  abnormal: [4, 10] },
        prosocial:    { normal: [6, 10], borderline: [5, 5],  abnormal: [0, 4]  },
        total:        { normal: [0, 13], borderline: [14, 16], abnormal: [17, 40] },
    },
    teacher_report: {
        emotional:    { normal: [0, 4],  borderline: [5, 5],  abnormal: [6, 10] },
        conduct:      { normal: [0, 2],  borderline: [3, 3],  abnormal: [4, 10] },
        hyperactivity:{ normal: [0, 5],  borderline: [6, 6],  abnormal: [7, 10] },
        peer:         { normal: [0, 3],  borderline: [4, 4],  abnormal: [5, 10] },
        prosocial:    { normal: [6, 10], borderline: [5, 5],  abnormal: [0, 4]  },
        total:        { normal: [0, 11], borderline: [12, 15], abnormal: [16, 40] },
    },
    youth_self_report: {
        emotional:    { normal: [0, 5],  borderline: [6, 6],  abnormal: [7, 10] },
        conduct:      { normal: [0, 3],  borderline: [4, 4],  abnormal: [5, 10] },
        hyperactivity:{ normal: [0, 5],  borderline: [6, 6],  abnormal: [7, 10] },
        peer:         { normal: [0, 3],  borderline: [4, 5],  abnormal: [6, 10] },
        prosocial:    { normal: [6, 10], borderline: [5, 5],  abnormal: [0, 4]  },
        total:        { normal: [0, 15], borderline: [16, 19], abnormal: [20, 40] },
    },
};

function categorize(score: number, threshold: DomainThreshold): SdqCategory {
    if (score >= threshold.normal[0] && score <= threshold.normal[1]) return "normal";
    if (score >= threshold.borderline[0] && score <= threshold.borderline[1]) return "borderline";
    return "abnormal";
}

const DOMAIN_DESCRIPTIONS: Record<string, Record<SdqCategory, string>> = {
    emotional: {
        normal:     "Skor berada dalam rentang normal. Tidak terdapat peningkatan skor yang menonjol pada aspek emosional.",
        borderline: "Skor sedikit meningkat. Terdapat beberapa indikasi kesulitan emosional, seperti kecenderungan merasa khawatir, takut, atau sedih yang perlu diperhatikan.",
        abnormal:   "Skor berada di atas rentang normal. Terdapat indikasi kesulitan emosional yang lebih menonjol, seperti kecenderungan mengalami kecemasan, ketakutan, atau kesedihan.",
    },
    conduct: {
        normal:     "Skor berada dalam rentang normal. Tidak terdapat peningkatan skor yang menonjol pada aspek perilaku.",
        borderline: "Skor sedikit meningkat. Terdapat beberapa indikasi kesulitan dalam mengendalikan perilaku atau mengikuti aturan.",
        abnormal:   "Skor berada di atas rentang normal. Terdapat indikasi masalah perilaku yang lebih menonjol, seperti kesulitan mengendalikan emosi, mengikuti aturan, atau mengelola perilaku terhadap orang lain.",
    },
    hyperactivity: {
        normal:     "Skor berada dalam rentang normal. Tidak terdapat peningkatan skor yang menonjol pada aspek hiperaktivitas dan perhatian.",
        borderline: "Skor sedikit meningkat. Terdapat beberapa indikasi kesulitan dalam mempertahankan perhatian, mengendalikan aktivitas, atau mengelola perilaku impulsif.",
        abnormal:   "Skor berada di atas rentang normal. Terdapat indikasi kesulitan yang lebih menonjol dalam mempertahankan perhatian, mengendalikan aktivitas, atau mengelola perilaku impulsif.",
    },
    peer: {
        normal:     "Skor berada dalam rentang normal. Tidak terdapat peningkatan skor yang menonjol pada aspek hubungan dengan teman sebaya.",
        borderline: "Skor sedikit meningkat. Terdapat beberapa indikasi kesulitan dalam menjalin atau mempertahankan hubungan dengan teman sebaya.",
        abnormal:   "Skor berada di atas rentang normal. Terdapat indikasi kesulitan yang lebih menonjol dalam hubungan sosial, seperti kesulitan menjalin pertemanan atau merasa kurang diterima oleh teman sebaya.",
    },
    prosocial: {
        normal:     "Skor berada dalam rentang normal. Perilaku prososial, seperti kepedulian, berbagi, dan membantu orang lain, berada dalam rentang yang diharapkan.",
        borderline: "Skor sedikit lebih rendah dari rentang normal. Beberapa perilaku prososial, seperti kepedulian, berbagi, atau membantu orang lain, perlu mendapatkan perhatian.",
        abnormal:   "Skor berada di bawah rentang normal. Terdapat indikasi rendahnya perilaku prososial, seperti kurang menunjukkan kepedulian, kesediaan berbagi, atau membantu orang lain.",
    },
    total: {
        normal:     "Skor total kesulitan berada dalam rentang normal. Secara keseluruhan, tidak terdapat peningkatan skor yang menonjol pada empat aspek kesulitan yang diukur SDQ.",
        borderline: "Skor total kesulitan sedikit meningkat dibandingkan rentang normal. Kondisi ini menunjukkan adanya beberapa aspek kesulitan yang perlu diperhatikan dan dipantau lebih lanjut.",
        abnormal:   "Skor total kesulitan berada di atas rentang normal. Hasil ini menunjukkan adanya peningkatan kesulitan pada satu atau beberapa aspek yang diukur SDQ sehingga disarankan untuk mendapatkan pemeriksaan lebih lanjut.",
    },
};

function buildSdqRows(r: SdqResult, typeName: string): DetailRow[] {
    const t = THRESHOLDS[typeName] ?? THRESHOLDS.youth_self_report;

    const rows: DetailRow[] = [
        {
            aspect: "Emotional Symptoms",
            result: String(r.emotional_score),
            interpretation: DOMAIN_DESCRIPTIONS.emotional[categorize(r.emotional_score, t.emotional)],
            noteField: "emotional_note",
        },
        {
            aspect: "Conduct Problems",
            result: String(r.conduct_score),
            interpretation: DOMAIN_DESCRIPTIONS.conduct[categorize(r.conduct_score, t.conduct)],
            noteField: "conduct_note",
        },
        {
            aspect: "Hyperactivity",
            result: String(r.hyperactivity_score),
            interpretation: DOMAIN_DESCRIPTIONS.hyperactivity[categorize(r.hyperactivity_score, t.hyperactivity)],
            noteField: "hyperactivity_note",
        },
        {
            aspect: "Peer Problems",
            result: String(r.peer_score),
            interpretation: DOMAIN_DESCRIPTIONS.peer[categorize(r.peer_score, t.peer)],
            noteField: "peer_note",
        },
        {
            aspect: "Prosocial Behavior",
            result: String(r.prosocial_score),
            interpretation: DOMAIN_DESCRIPTIONS.prosocial[categorize(r.prosocial_score, t.prosocial)],
            noteField: "prosocial_note",
        },
        {
            aspect: "Total Difficulties",
            result: String(r.total_difficulties),
            interpretation: DOMAIN_DESCRIPTIONS.total[categorize(r.total_difficulties, t.total)],
        },
    ];

    return rows;
}

function buildSrqRows(r: SrqResult): DetailRow[] {
    return [
        {
            aspect: "Gangguan Mental Emosional",
            result: r.gme_indication ? "Terindikasi" : "Tidak Terindikasi",
            interpretation: r.gme_indication
                ? "Hasil skrining menunjukkan adanya indikasi gangguan mental emosional. Peserta disarankan menjalani pemeriksaan lebih lanjut untuk memahami kondisi emosional dan psikologis yang dialami."
                : "Hasil skrining tidak menunjukkan indikasi gangguan mental emosional berdasarkan ambang batas yang digunakan. Hasil ini tidak sepenuhnya menyingkirkan kemungkinan adanya kesulitan psikologis.",
            noteField: "gme_note",
        },
        {
            aspect: "Penggunaan Zat",
            result: r.substance_use_indication ? "Terindikasi" : "Tidak Terindikasi",
            interpretation: r.substance_use_indication
                ? "Jawaban menunjukkan indikasi penggunaan zat. Diperlukan evaluasi lebih lanjut untuk memahami jenis, pola, dan dampak penggunaan zat tersebut."
                : "Tidak terdapat indikasi penggunaan zat berdasarkan jawaban pada pertanyaan skrining ini.",
            noteField: "substance_use_note",
        },
        {
            aspect: "Gejala Psikotik",
            result: r.psychotic_symptom_indication ? "Terindikasi" : "Tidak Terindikasi",
            interpretation: r.psychotic_symptom_indication
                ? "Jawaban menunjukkan adanya indikasi gejala yang berkaitan dengan kondisi psikotik. Peserta disarankan mendapatkan pemeriksaan lebih lanjut oleh tenaga profesional."
                : "Tidak terdapat indikasi gejala psikotik berdasarkan jawaban pada kelompok pertanyaan ini.",
            noteField: "psychotic_symptom_note",
        },
        {
            aspect: "Gejala PTSD",
            result: r.ptsd_symptom_indication ? "Terindikasi" : "Tidak Terindikasi",
            interpretation: r.ptsd_symptom_indication
                ? "Jawaban menunjukkan adanya indikasi gejala yang berkaitan dengan gangguan stres pascatrauma (PTSD). Pemeriksaan lebih lanjut diperlukan untuk memahami gejala dan pengalaman yang mendasarinya."
                : "Tidak terdapat indikasi gejala PTSD berdasarkan jawaban pada kelompok pertanyaan ini.",
            noteField: "ptsd_symptom_note",
        },
    ];
}

export function getScreeningDetailRows(screening: ScreeningResult): DetailRow[] {
    if (screening.sdq_result) {
        const typeName = screening.instrument_type?.type_name ?? "youth_self_report";
        return buildSdqRows(screening.sdq_result, typeName);
    }

    if (screening.srq_result) {
        return buildSrqRows(screening.srq_result);
    }

    return [];
}

export function getScreeningCategory(screening: ScreeningResult) {
    if (screening.sdq_result) {
        return screening.sdq_result.overall_category;
    }

    if (screening.srq_result) {
        const srq = screening.srq_result;
        const isIndicated =
            srq.gme_indication ||
            srq.substance_use_indication ||
            srq.psychotic_symptom_indication ||
            srq.ptsd_symptom_indication;

        return isIndicated ? "Terindikasi" : "Tidak Terindikasi";
    }

    return null;
}

export const statusColor: Record<string, any> = {
    "Menunggu Evaluasi": "info",
    "Selesai Dievaluasi": "success",
};
