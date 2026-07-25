import { useState } from "react";
import { usePage } from "@inertiajs/react";

import { OnboardingPageProps } from "@/types/onboarding";

import WelcomeStep from "./Partials/WelcomeStep";
import RoleStep from "./Partials/RoleStep";
import BasicInfoStep from "./Partials/BasicInfoStep";
import ParentRoleStep from "./Partials/ParentRoleStep";
import SchoolRoleStep from "./Partials/SchoolRoleStep";
import GeneralRoleStep from "./Partials/GeneralRoleStep";
import ConfirmStep from "./Partials/ConfirmStep";

export default function Index() {
    const { user } = usePage<OnboardingPageProps>().props;

    const [step, setStep] = useState(0);

    const next = () => setStep((prev) => prev + 1);
    const prev = () => setStep((prev) => prev - 1);

    return (
        <div className="min-h-screen flex items-center justify-center bg-netral-100">
            {step === 0 && <WelcomeStep step={step} onNext={next} />}

            {step === 1 && (
                <RoleStep step={step} onNext={next} />
            )}

            {step === 2 && (
                <BasicInfoStep step={step} onNext={next} onPrev={prev} />
            )}

            {step === 3 && user?.role === "parent" && (
                <ParentRoleStep step={step} onNext={next} onPrev={prev} />
            )}

            {step === 3 && user?.role === "school" && (
                <SchoolRoleStep step={step} onNext={next} onPrev={prev} />
            )}

            {step === 3 && user?.role === "general" && (
                <GeneralRoleStep step={step} onNext={next} onPrev={prev} />
            )}

            {step === 4 && (
                <ConfirmStep step={step} onNext={next} onPrev={prev} />
            )}
        </div>
    );
}
