import { ScreeningResult } from "@/types/screening";

export const screenings: ScreeningResult[] = [
    {
        id: "1",

        subject: {
            id: "s1",
            name: "Irsyam Okta Pratama Riyadi",
        },

        reporter: {
            id: "u1",
            name: "Riyadi",
            role: "parent",
        },

        instrument: {
            id: "i1",
            name: "SDQ",
        },

        instrument_type: {
            id: "t1",
            type_name: "parent_report",
        },

        sdq_result: {
            id: "sdq1",

            psychologist: {
                id: "p1",
                name: "Dr. Andi Pratama, M.Psi",
            },

            emotional_score: 4,
            emotional_note:
                "Anak cukup mampu mengontrol emosi dalam situasi sosial.",

            conduct_score: 3,
            conduct_note:
                "Tidak ditemukan perilaku agresif yang signifikan.",

            hyperactivity_score: 6,
            hyperactivity_note:
                "Cenderung aktif dan sulit mempertahankan perhatian.",

            peer_score: 5,
            peer_note:
                "Memiliki beberapa kesulitan dalam berinteraksi dengan teman.",

            prosocial_score: 7,
            prosocial_note:
                "Menunjukkan empati dan perilaku membantu orang lain.",

            total_difficulties: 18,

            overall_category: "Borderline",

            recommendation:
                "Disarankan memberikan aktivitas untuk meningkatkan fokus.",

            date_analysis: "2026-03-14 12:34:56",

            created_at: "2026-03-14 12:34:56",
        },

        date_taken: "2026-03-14 12:34:56",

        status: "evaluasi",
    },

    {
        id: "2",

        subject: {
            id: "s2",
            name: "Diva Dita Nara",
        },

        reporter: {
            id: "u2",
            name: "Bu Ratna",
            role: "teacher",
        },

        instrument: {
            id: "i1",
            name: "SDQ",
        },

        instrument_type: {
            id: "t2",
            type_name: "teacher_report",
        },

        sdq_result: {
            id: "sdq2",

            psychologist: {
                id: "p2",
                name: "Dr. Maya Putri, M.Psi",
            },

            emotional_score: 2,
            conduct_score: 1,
            hyperactivity_score: 3,
            peer_score: 2,
            prosocial_score: 8,

            total_difficulties: 8,

            overall_category: "Normal",

            recommendation:
                "Pertahankan lingkungan belajar yang suportif.",

            date_analysis: "2026-03-14 12:34:56",

            created_at: "2026-03-14 12:34:56",
        },

        date_taken: "2026-03-14 12:34:56",

        status: "terkirim",
    },

    {
        id: "3",

        subject: {
            id: "s3",
            name: "Muhammad Agam Nasywaan",
        },

        reporter: {
            id: "u3",
            name: "Agam",
            role: "self",
        },

        instrument: {
            id: "i1",
            name: "SDQ",
        },

        instrument_type: {
            id: "t3",
            type_name: "youth_self_report",
        },

        sdq_result: {
            id: "sdq3",

            psychologist: {
                id: "p1",
                name: "Dr. Andi Pratama, M.Psi",
            },

            emotional_score: 8,
            conduct_score: 6,
            hyperactivity_score: 7,
            peer_score: 7,
            prosocial_score: 3,

            total_difficulties: 28,

            overall_category: "Abnormal",

            recommendation:
                "Disarankan melakukan sesi konseling lanjutan.",

            date_analysis: "2026-03-14 12:34:56",

            created_at: "2026-03-14 12:34:56",
        },

        date_taken: "2026-03-14 12:34:56",

        status: "terkirim",
    },

    {
        id: "4",

        subject: {
            id: "s4",
            name: "Alfa Rajendriya",
        },

        reporter: {
            id: "u4",
            name: "Alfa",
            role: "self",
        },

        instrument: {
            id: "i2",
            name: "SRQ",
        },

        instrument_type: {
            id: "t4",
            type_name: "self_report",
        },

        srq_result: {
            id: "srq1",

            psychologist: {
                id: "p2",
                name: "Dr. Maya Putri, M.Psi",
            },

            gme_score: 7,

            gme_indication: true,

            substance_use_indication: false,

            psychotic_symptom_indication: true,

            ptsd_symptom_indication: false,

            recommendation:
                "Disarankan evaluasi klinis lebih lanjut.",

            date_analysis: "2026-03-14 12:34:56",

            created_at: "2026-03-14 12:34:56",
        },

        date_taken: "2026-03-14 12:34:56",

        status: "evaluasi",
    },
];