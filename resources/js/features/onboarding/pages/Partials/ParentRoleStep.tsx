import { Head, useForm, usePage } from "@inertiajs/react";

import { OnboardingPageProps, OnboardingSubjectForm, NextProps } from "@/types/onboarding";

import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import StepProgress from "@/features/onboarding/pages/Components/StepProgress";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import Logo from "@assets/svg/logo-color.svg";

export default function ParentRoleStep({ step, onNext, onPrev }: NextProps) {
    const { subject } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<OnboardingSubjectForm>({
        name: subject?.name ?? "",
        gender: subject?.gender ?? "",
        age: subject?.age ?? "",
        has_previous_screening: subject?.has_previous_screening ?? false,
        last_result: subject?.last_result ?? "",
    });

    const canSelectResult = data.has_previous_screening === true;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("onboarding.parent"), {
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
                        Peran Anda sebagai Orang Tua
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
                        id="form-role-parent"
                        className="flex flex-col gap-6 pb-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-3">
                            {/* Children Name */}
                            <Input
                                label="Siapa nama anak Anda?"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Masukkan nama lengkap"
                                onChange={(e) => setData("name", e.target.value)}
                                error={errors.name}
                                required
                            />

                            {/* Age */}
                            <Input
                                label="Berapa usia anak Anda?"
                                type="number"
                                name="name"
                                value={data.age}
                                placeholder="Masukkan usia anak"
                                className="no-spinner"
                                max={75}
                                onChange={(e) => setData("age", e.target.value)}
                                error={errors.age}
                                required
                            />
                        </div>

                        {/* Gender */}
                        <RadioButtonGroup
                            label="Apa jenis kelamin anak Anda?"
                            name="role"
                            value={data.gender ?? "male"}
                            height="h-10"
                            onChange={(value) => setData("gender", value)}
                            required
                            options={[
                                { label: "Laki-laki", value: "male" },
                                { label: "Perempuan", value: "female" },
                            ]}
                        />

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
                    form="form-role-parent"
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
