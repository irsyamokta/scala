import { Head, useForm, usePage } from "@inertiajs/react";

import { OnboardingPageProps, OnboardingRoleForm, NextProps } from "@/types/onboarding";

import Button from "@/shared/components/ui/button/Button";
import Badge from "@/shared/components/ui/badge/Badge";
import Form from "@/shared/components/forms/Form";
import RadioButtonGroup from "@/shared/components/forms/RadioButtonGroup";

import { PiInfoFill } from "react-icons/pi";

import Logo from "@assets/svg/logo-color.svg";

export default function RoleStep({ onNext }: NextProps) {
    const { user } = usePage<OnboardingPageProps>().props;

    const { data, setData, post, processing } = useForm<OnboardingRoleForm>({
        role: user.role ?? "parent",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("onboarding.role"), {
            onSuccess: () => {
                onNext();
            },
        });
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl">
            <Head title="Tentukan Peran" />

            <div className="pt-6 pb-4 shrink-0">
                {/* Logo */}
                <img
                    src={Logo}
                    alt="Scala logo"
                    className="mx-auto mb-10"
                />

                {/* Badge */}
                <div className="flex flex-col justify-center items-center">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Identifikasi Peran
                        </div>
                    </Badge>
                    <h2
                        className="header-4 mb-4 text-center px-6"
                        data-aos="fade-right"
                    >
                        Peran apa yang paling menggambarkan Anda dalam penggunaan platform ini?
                    </h2>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6">
                <div
                    className="w-full"
                    data-aos="fade-right"
                >
                    <Form
                        id="form-role"
                        onSubmit={handleSubmit}
                    >
                        <RadioButtonGroup
                            name="role"
                            value={data.role}
                            onChange={(value) => setData("role", value)}
                            options={[
                                { label: "Orang Tua", value: "parent" },
                                { label: "Sekolah", value: "school" },
                                { label: "Umum", value: "general" },
                            ]}
                        />
                    </Form>
                </div>

                <div
                    className="flex justify-center items-center gap-2 text-netral-700 mt-8"
                    data-aos="fade-right"
                >
                    <PiInfoFill size={20} className="text-primary shrink-0" />
                    <p className="paragraph-1 text-xs md:text-sm">
                        Peran ini akan menentukan fitur dan akses dashboard Anda.
                    </p>
                </div>

            </div>

            <div className="px-6 py-4 bg-netral-100 flex items-center justify-center gap-4 shrink-0">
                <Button
                    type="submit"
                    form="form-role"
                    size="lg"
                    disabled={processing}
                    className="w-full sm:w-76"
                >
                    Selanjutnya
                </Button>
            </div>
        </div>
    );
}
