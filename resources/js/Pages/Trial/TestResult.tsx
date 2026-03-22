import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import CardResult from "./Components/card/CardResult";
import NotFound from "../Errors/404";

interface SRQResult {
    gme: boolean;
    zat: boolean;
    psikotik: boolean;
    ptsd: boolean;
}

export default function TestResult() {

    const [result, setResult] = useState<SRQResult | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("srq_result");

        if (stored) {
            setResult(JSON.parse(stored));
            localStorage.removeItem("srq_result");
        }
    }, []);

    if (!result) return (
        <NotFound />
    );

    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="Hasil SRQ" />

            <CardResult result={result} />
        </AppLayout>
    );
}
