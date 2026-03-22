import { Head, useForm, usePage } from "@inertiajs/react";

import { OnboardingPageProps, OnboardingSubjectForm, NextProps } from "@/types/onboarding";

import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import StepProgress from "@/Pages/Onboarding/Components/StepProgress";
import RadioButtonGroup from "@/Components/form/input/RadioButtonGroup";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import Logo from "../../../../assets/svg/logo-color.svg";

export default function GeneralRoleStep({ step, onNext, onPrev }: NextProps) {
    const { subject } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<OnboardingSubjectForm>({
        has_previous_screening: subject?.has_previous_screening ?? false,
        last_result: subject?.last_result ?? "",
    });

    const canSelectResult = data.has_previous_screening === true;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("onboarding.general"), {
            onSuccess: () => {
                onNext();
            },
        });
    };

    return (
        <div className="flex flex-col h-screen xsm:min-w-md md:min-w-3xl">
            <Head title="Informasi Lanjutan" />

            <div className="px-6 pt-6 pb-4 shrink-0">
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
                            Informasi Lanjutan
                        </div>
                    </Badge>
                    <Badge color="success">
                        Peran Anda sebagai Umum
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
                        id="form-role-general"
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >

                        {/* First Time */}
                        <RadioButtonGroup
                            label="Apakah ini pertama kalinya Anda melakukan skrining?"
                            name="has_previous_screening"
                            value={data.has_previous_screening}
                            height="h-10"
                            onChange={(value) => {
                                setData("has_previous_screening", value);

                                if (!value) {
                                    setData("last_result", "");
                                }
                            }}
                            required
                            options={[
                                { label: "Ya, pertama kali", value: false },
                                { label: "Tidak, sudah pernah sebelumnya", value: true },
                            ]}
                        />

                        {/* Result Test */}
                        <RadioButtonGroup
                            label="Jika sudah pernah, apa hasil tes terakhir?"
                            name="last_result"
                            value={data.last_result ?? ""}
                            height="h-8"
                            onChange={(value) => setData("last_result", value)}
                            required={canSelectResult}
                            disabled={!canSelectResult}
                            options={[
                                { label: "Normal", value: "Normal" },
                                { label: "Borderline", value: "Borderline" },
                                { label: "Abnormal", value: "Abnormal" },
                                { label: "Terindikasi", value: "Terindikasi" },
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
                    form="form-role-general"
                    size="lg"
                    disabled={processing}
                >
                    <span className="hidden md:inline">
                        Selanjutnya
                    </span>

                    <span className="md:hidden">
                        <HiChevronRight size={22} />
                    </span>
                </Button>
            </div>
        </div>
    );
}
