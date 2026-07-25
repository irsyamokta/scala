import { Head, useForm, usePage } from "@inertiajs/react";

import { OnboardingPageProps, OnboardingBasicInfoForm, NextProps } from "@/types/onboarding";

import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import Form from "@/shared/components/forms/Form";
import Input from "@/shared/components/forms/InputField";
import TextArea from "@/shared/components/forms/TextArea";
import StepProgress from "@/features/onboarding/pages/Components/StepProgress";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import Logo from "@assets/svg/logo-color.svg";

export default function BasicInfoStep({ step, onNext, onPrev }: NextProps) {
    const { user, selfSubject } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<OnboardingBasicInfoForm>({
        name: user.name ?? "",
        age: selfSubject?.age ?? "",
        domicile: user.domicile ?? "",
        gender: selfSubject?.gender ?? "",
        contact: user.contact ?? "",
        objective: user.objective ?? "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("onboarding.basic"), {
            onSuccess: () => {
                onNext();
            },
        });
    };

    return (
        <div className="flex flex-col h-screen xsm:min-w-md md:min-w-3xl">
            <Head title="Informasi Dasar" />

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
                            Informasi Dasar
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
                        id="form-basic-info"
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid md:grid-cols-2 gap-3">
                            {/* Name */}
                            <Input
                                label="Siapa nama lengkap Anda?"
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
                                label="Berapa usia Anda?"
                                type="number"
                                name="age"
                                value={data.age}
                                placeholder="Masukkan usia Anda"
                                className="no-spinner"
                                max={75}
                                onChange={(e) => setData("age", e.target.value)}
                                error={errors.age}
                                required
                            />
                        </div>

                        {/* Gender */}
                        <RadioButtonGroup
                            label="Apa jenis kelamin Anda?"
                            name="gender"
                            value={data.gender ?? ""}
                            height="h-10"
                            onChange={(value) => setData("gender", value)}
                            required
                            options={[
                                { label: "Laki-laki", value: "male" },
                                { label: "Perempuan", value: "female" },
                            ]}
                        />

                        <div className="grid md:grid-cols-2 gap-3">

                            {/* Domicile */}
                            <Input
                                label="Dimana domisili Anda berada?"
                                type="text"
                                name="domicile"
                                value={data.domicile}
                                placeholder="Masukkan domisili Anda"
                                onChange={(e) => setData("domicile", e.target.value)}
                                error={errors.domicile}
                                required
                            />

                            {/* Contact */}
                            <Input
                                label="Kontak yang bisa dihubungi?"
                                type="number"
                                name="contact"
                                value={data.contact}
                                placeholder="cth: 081234567890"
                                className="no-spinner"
                                onChange={(e) => setData("contact", e.target.value)}
                                error={errors.contact}
                                required
                            />
                        </div>

                        {/* Objective */}
                        <TextArea
                            label="Apa tujuan Anda menggunakan platform ini?"
                            value={data.objective}
                            placeholder="Tuliskan tujuan Anda"
                            onChange={(value) => setData("objective", value)}
                            error={errors.objective}
                            required
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
                    form="form-basic-info"
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
