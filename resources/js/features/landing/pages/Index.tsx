import { Head } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";

import AppFooter from "@/shared/components/app/AppFooter";
import HeroSection from "./section/HeroSection";
import AboutSection from "./section/AboutSection";
import UserSection from "./section/UserSection";
import InstrumentSection from "./section/InstrumentSection";
import PsychologSection from "./section/PsychologSection";
import TrialSection from "./section/TrialSection";
import CTASection from "./section/CTASection";

export default function Home() {
    return (
        <AppLayout>
            <Head title="Beranda" />

            <HeroSection />
            <AboutSection />
            <UserSection />
            <InstrumentSection />
            <PsychologSection />
            <TrialSection />
            <CTASection />
            <AppFooter />
        </AppLayout>
    );
}
