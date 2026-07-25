import { Head, useForm, usePage, router } from "@inertiajs/react";

import { OnboardingConfirmedForm, OnboardingPageProps, NextProps } from "@/types/onboarding";

import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import Form from "@/shared/components/forms/Form";
import StepProgress from "../Components/StepProgress";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import Logo from "@assets/svg/logo-color.svg";

export default function ConfirmStep({ step, onNext, onPrev }: NextProps) {
    const { user } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<OnboardingConfirmedForm>({
        onboarding_completed_at: false,
    });

    const canSubmit = data.onboarding_completed_at && !processing;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.visit(route("onboarding.processing"), {
            method: "get",
            data: data as any
        });
    };

    return (
        <div className="flex flex-col h-screen xsm:min-w-md md:min-w-3xl">
            <Head title="Konfirmasi Data" />

            <div className="pt-6 pb-4 shrink-0">

                {/* Logo */}
                <img
                    src={Logo}
                    alt="Scala logo"
                    className="mx-auto mb-10"
                />

                {/* Badge */}
                <div className="flex flex-col justify-center items-center mb-8 gap-8">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Konfirmasi Data
                        </div>
                    </Badge>
                    <Badge color="success">
                        Peran Anda sebagai {
                            user.role === "parent"
                                ? "Orang Tua"
                                : user.role === "school"
                                    ? "Sekolah"
                                    : user.role === "general"
                                        ? "Umum"
                                        : ""
                        }
                    </Badge>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6">
                <div
                    className="w-full"
                    data-aos="fade-right"
                >
                    <Form
                        id="form-confirmed"
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >

                        {/* Onboarding Confirmation */}
                        <RadioButtonGroup
                            label="Apakah seluruh informasi yang Anda berikan sudah benar?"
                            name="onboarding_completed_at"
                            value={data.onboarding_completed_at}
                            height="h-10"
                            onChange={(value) => setData("onboarding_completed_at", value)}
                            required
                            options={[
                                { label: "Ya, sudah benar", value: true },
                                { label: "Tidak, saya ingin cek kembali", value: false },
                            ]}
                        />
                    </Form>
                </div>
            </div>

            {/* Action Button */}
            <div className="px-6 py-4 bg-netral-100 flex items-center justify-between gap-4 shrink-0">
                <Button
                    type="button"
                    size="lg"
                    onClick={onPrev}
                >
                    <span className="md:hidden">
                        <HiChevronLeft size={22} />
                    </span>

                    <span className="hidden md:inline">
                        Sebelumnya
                    </span>
                </Button>

                <StepProgress step={step - 2} total={3} />

                <Button
                    type="submit"
                    form="form-confirmed"
                    size="lg"
                    disabled={!canSubmit}
                >
                    <span className="hidden md:inline">
                        Buat Akun
                    </span>

                    <span className="md:hidden">
                        <HiChevronRight size={22} />
                    </span>
                </Button>
            </div>
        </div>
    );
}
