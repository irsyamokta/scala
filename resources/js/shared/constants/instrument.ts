import { InstrumentName, InstrumentConfig } from "@/types/instrument"

export const SDQ_DOMAINS = [
    { value: "emotional_symptoms", label: "Emotional Symptoms" },
    { value: "conduct_problems", label: "Conduct Problems" },
    { value: "hyperactivity", label: "Hyperactivity" },
    { value: "peer_problems", label: "Peer Problems" },
    { value: "prosocial", label: "Prosocial" }
]

export const INSTRUMENT_CONFIG: Record<InstrumentName, InstrumentConfig> = {
    SDQ: {
        types: [
            { key: "parent_report", min: 4, max: 17 },
            { key: "teacher_report", min: 4, max: 17 },
            { key: "youth_self_report", min: 11, max: 17 }
        ],
        hasDomain: true,
        hasReverse: true
    },

    SRQ: {
        types: [
            { key: "self_report", min: 18, max: 100 }
        ],
        hasDomain: false,
        hasReverse: false
    }
}
