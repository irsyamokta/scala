import { ScreeningResult, ScreeningNoteForm } from "@/types/screening";
import { SDQ_RANGES } from "@/constants/screening";

export type DetailRow = {
    aspect: string;
    range: string;
    result: string;
    note?: string;
    noteField?: keyof ScreeningNoteForm;
};

export function getScreeningDetailRows(
    screening: ScreeningResult
): DetailRow[] {

    if (screening.sdq_result) {

        const r = screening.sdq_result;

        return [
            {
                aspect: "Emotional Symptoms",
                range: "0 - 10",
                result: r.emotional_score?.toString() ?? "-",
                note: r.emotional_note,
                noteField: "emotional_note",
            },
            {
                aspect: "Conduct Problems",
                range: "0 - 10",
                result: r.conduct_score?.toString() ?? "-",
                note: r.conduct_note,
                noteField: "conduct_note",
            },
            {
                aspect: "Hyperactivity",
                range: "0 - 10",
                result: r.hyperactivity_score?.toString() ?? "-",
                note: r.hyperactivity_note,
                noteField: "hyperactivity_note",
            },
            {
                aspect: "Peer Problems",
                range: "0 - 10",
                result: r.peer_score?.toString() ?? "-",
                note: r.peer_note,
                noteField: "peer_note",
            },
            {
                aspect: "Prosocial Behavior",
                range: "0 - 10",
                result: r.prosocial_score?.toString() ?? "-",
                note: r.prosocial_note,
                noteField: "prosocial_note",
            },
        ];
    }

    if (screening.srq_result) {

        const r = screening.srq_result;

        return [
            {
                aspect: "Gangguan Mental Emosional",
                range: "≥5 YA dari pertanyaan 1-20",
                result: r.gme_indication ? "Terindikasi" : "Tidak",
                note: r.gme_note,
                noteField: "gme_note",
            },
            {
                aspect: "Penggunaan Zat",
                range: "YA pada pertanyaan 21",
                result: r.substance_use_indication ? "Ya" : "Tidak",
                note: r.substance_use_note,
                noteField: "substance_use_note",
            },
            {
                aspect: "Gejala Psikotik",
                range: "YA pada pertanyaan 22-24",
                result: r.psychotic_symptom_indication ? "Ya" : "Tidak",
                note: r.psychotic_symptom_note,
                noteField: "psychotic_symptom_note",
            },
            {
                aspect: "Gejala PTSD",
                range: "YA pada pertanyaan 25-29",
                result: r.ptsd_symptom_indication ? "Ya" : "Tidak",
                note: r.ptsd_symptom_note,
                noteField: "ptsd_symptom_note",
            },
        ];
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

        return isIndicated
            ? "Terindikasi"
            : "Tidak Terindikasi";
    }

    return null;
}

export function getSdqRanges(type: string) {
    return SDQ_RANGES[type as keyof typeof SDQ_RANGES] ?? [];
}

export const statusColor: Record<string, any> = {
    "Menunggu Evaluasi": "info",
    "Selesai Dievaluasi": "success",
};
