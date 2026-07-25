import { Head } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";
import CardTrialTest from "./Components/card/CardTrialTest";

export default function TrialTest() {
    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="SRQ" />

            <CardTrialTest />
        </AppLayout>
    );
}
