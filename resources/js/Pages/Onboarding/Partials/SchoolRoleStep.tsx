import { Head, useForm, usePage } from "@inertiajs/react";

import { OnboardingPageProps, OnboardingSchoolForm, NextProps } from "@/types/onboarding";

import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import TextArea from "@/Components/form/input/TextArea";
import StepProgress from "@/Pages/Onboarding/Components/StepProgress";
import RadioButtonGroup from "@/Components/form/input/RadioButtonGroup";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import Logo from "../../../../assets/svg/logo-color.svg";

export default function SchoolRoleStep({ step, onNext, onPrev }: NextProps) {
    const { user } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing, errors } = useForm<OnboardingSchoolForm>({
        school_name: user?.school_name ?? "",
        school_level: user?.school_level ?? "",
        school_address: user?.school_address ?? "",
        screening_scope: user?.screening_scope ?? "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("onboarding.school"), {
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
                        Peran Anda sebagai Sekolah
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
                        id="form-role-school"
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        {/* Level Education */}
                        <RadioButtonGroup
                            label="Apa jenjang pendidikan sekolah Anda?"
                            name="school_level"
                            value={data.school_level}
                            height="h-10"
                            onChange={(value) => setData("school_level", value)}
                            required
                            options={[
                                { label: "TK", value: "TK" },
                                { label: "SD/MI", value: "SD/MI" },
                                { label: "SMP/Mts", value: "SMP/Mts" },
                                { label: "SMA/SMK", value: "SMA/SMK" },
                            ]}
                        />

                        {/* School Name */}
                        <Input
                            label="Apa nama sekolah Anda?"
                            type="text"
                            name="school_name"
                            value={data.school_name}
                            placeholder="Masukkan nama sekolah"
                            onChange={(e) => setData("school_name", e.target.value)}
                            error={errors.school_name}
                            required
                        />

                        {/* Address */}
                        <TextArea
                            label="Dimana alamat sekolah Anda berada?"
                            value={data.school_address}
                            placeholder="Masukkan alamat lengkap sekolah"
                            onChange={(value) => setData("school_address", value)}
                            error={errors.school_address}
                            required
                        />

                        {/* Screening Scope */}
                        <RadioButtonGroup
                            label="Apakah sekolah akan melakukan skrining untuk satu siswa atau satu kelas?"
                            name="screening_scope"
                            value={data.screening_scope}
                            height="h-8"
                            onChange={(value) => setData("screening_scope", value)}
                            required
                            options={[
                                { label: "Satu siswa", value: "single_student" },
                                { label: "Beberapa siswa", value: "multiple_student" },
                                { label: "Satu kelas", value: "classroom" },
                            ]}
                        />
                    </Form>
                </div>
            </div>

            {/* Actiion Button */}
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
                    form="form-role-school"
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
