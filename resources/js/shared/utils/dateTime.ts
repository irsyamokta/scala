export function formatDmy(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatHhmm(raw: string): string {
    let digits = raw.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 1) {
        const h1 = parseInt(digits[0], 10);
        if (h1 > 2) digits = "0" + digits.slice(0, 3);
    }
    if (digits.length >= 2) {
        const hh = parseInt(digits.slice(0, 2), 10);
        if (hh > 23) digits = "23" + digits.slice(2);
    }
    if (digits.length >= 3) {
        const m1 = parseInt(digits[2], 10);
        if (m1 > 5) digits = digits.slice(0, 2) + "5" + digits.slice(3, 4);
    }
    if (digits.length >= 4) {
        const mm = parseInt(digits.slice(2, 4), 10);
        if (mm > 59) digits = digits.slice(0, 2) + "59";
    }

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function toIsoDate(dmy: string): string {
    if (!dmy) return "";
    const [d, m, y] = dmy.split("/");
    if (!d || !m || !y || y.length < 4) return "";
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export function toIsoDatetime(date: string, time: string): string {
    if (!date) return "";
    const [d, m, y] = date.split("/");
    if (!d || !m || !y || y.length < 4) return "";
    const [hh, mm] = (time || "00:00").split(":");
    if (!hh || !mm || mm.length < 2) return "";
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")} ${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
}

export function parseExpiresAt(isoOrDate: string | null | undefined): {
    date: string;
    time: string;
    day: string;
    month: string;
    year: string;
    hours: string;
    minutes: string;
} {
    if (!isoOrDate) {
        return { date: "", time: "", day: "", month: "", year: "", hours: "", minutes: "" };
    }
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) {
        return { date: "", time: "", day: "", month: "", year: "", hours: "", minutes: "" };
    }

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear());
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}`,
        day,
        month,
        year,
        hours,
        minutes,
    };
}

export function validateExpiry(
    date: string,
    time: string,
    isEdit = false,
    originalExpiry?: string | null
): string | null {
    if (!date) return null;
    const [d, m, y] = date.split("/");
    if (!d || !m || !y || y.length < 4) return null;

    const fullYear = parseInt(y, 10);
    const month = parseInt(m, 10) - 1;
    const day = parseInt(d, 10);

    if (isNaN(fullYear) || isNaN(month) || isNaN(day)) return "Tanggal tidak valid.";

    const [hh, mm] = (time || "00:00").split(":");
    const expiry = new Date(fullYear, month, day, parseInt(hh || "0", 10), parseInt(mm || "0", 10));

    if (isNaN(expiry.getTime())) return "Tanggal tidak valid.";

    if (isEdit && originalExpiry) {
        const orig = new Date(originalExpiry);
        if (Math.abs(orig.getTime() - expiry.getTime()) < 60000) {
            return null;
        }
    }

    if (expiry < new Date()) return "Tanggal kedaluwarsa tidak boleh di masa lalu.";

    return null;
}

