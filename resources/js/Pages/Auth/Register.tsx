import { useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";

import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import Button from "@/Components/ui/button/Button";

import { FcGoogle } from "react-icons/fc";

import Logo from "../../../assets/svg/logo-color.svg";
import Illustration from "../../../assets/img/img-register.webp";

export default function Register() {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error, flash?.success]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen grid lg:grid-cols-2 bg-netral-50">

                {/* Left */}
                <div className="flex flex-col items-center justify-center px-6 lg:px-20 py-5">

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold mb-10">
                        <img src={Logo} alt="Scala logo" />
                    </Link>

                    {/* Card */}
                    <div className="w-full max-w-md border border-netral-300 rounded-xl p-8">

                        <h1 className="text-xl font-semibold text-center mb-2">
                            Daftarkan Akun Anda
                        </h1>

                        <p className="text-sm text-netral-500 text-center mb-6">
                            Daftar untuk mulai melakukan skrining dan memantau kondisi emosional secara lebih terstruktur.
                        </p>

                        {/* Google Register */}
                        {/* <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            startIcon={<FcGoogle size={18} />}
                            className="w-full flex items-center justify-center text-sm gap-2 mb-6"
                            disabled
                        >
                            Daftar dengan Akun Google
                        </Button> */}

                        {/* Divider */}
                        {/* <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-netral-400"></div>
                            <span className="text-xs text-netral-500">
                                atau daftar dengan
                            </span>
                            <div className="flex-1 h-px bg-netral-400"></div>
                        </div> */}

                        {/* Form */}
                        <Form onSubmit={submit} className="space-y-4">

                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="example@gmail.com"
                                autoComplete="username"
                                onChange={(e) => setData("email", e.target.value)}
                                error={errors.email}
                            />

                            <Input
                                label="Password"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Masukkan password"
                                autoComplete="new-password"
                                onChange={(e) => setData("password", e.target.value)}
                                enablePasswordValidation={false}
                                error={errors.password}
                            />

                            <Input
                                label="Konfirmasi Password"
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Masukkan kembali password"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                enablePasswordValidation={false}
                                error={errors.password_confirmation}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-6"
                                disabled={processing}
                            >
                                Daftar Akun
                            </Button>

                        </Form>
                    </div>

                    {/* Login */}
                    <p className="text-sm text-netral-600 mt-6">
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="text-primary font-semibold hover:underline"
                        >
                            Masuk Akun
                        </Link>
                    </p>

                </div>

                {/* Right */}
                <div className="hidden lg:flex items-center justify-center p-6">
                    <div className="w-full h-182 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={Illustration}
                            alt="Register"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

            </div>
        </>
    );
}
