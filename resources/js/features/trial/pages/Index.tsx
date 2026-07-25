import { Head } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";
import CardInfo from "./Components/card/CardInfo";

export default function Trial() {
    return (
        <AppLayout navbar={{ hideOnScroll: false }}>
            <Head title="Uji Coba" />

            <CardInfo />
        </AppLayout>
    );
}
