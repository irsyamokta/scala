type Answer = 0 | 1 | null;

interface SRQResult {
    gme: boolean;
    zat: boolean;
    psikotik: boolean;
    ptsd: boolean;
}

export function calculateSRQ(answers: Answer[]): SRQResult {

    const countYes = (start: number, end: number) => {
        return answers
            .slice(start - 1, end)
            .filter((a) => a === 1).length;
    };

    const gme = countYes(1, 20) >= 5;

    const zat = answers[20] === 1;

    const psikotik = countYes(22, 24) >= 1;

    const ptsd = countYes(25, 29) >= 1;

    return {
        gme,
        zat,
        psikotik,
        ptsd,
    };
}
