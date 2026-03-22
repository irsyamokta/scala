import { useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";

import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import Button from "@/Components/ui/button/Button";

import { FcGoogle } from "react-icons/fc";

import Logo from "../../../assets/svg/logo-color.svg";
import Illustration from "../../../assets/img/img-login.webp";

export default function Login({ status }: { status?: string }) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error, flash?.success]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
            onSuccess: () => toast.success("Login Berhasil"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen grid lg:grid-cols-2 bg-netral-50">
                {/* Left */}
                <div className="flex flex-col items-center justify-center px-6 lg:px-20 py-10">

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold mb-10">
                        <img src={Logo} alt="Scala logo" />
                    </Link>

                    {/* Card */}
                    <div className="w-full max-w-md border border-netral-300 rounded-xl p-8">

                        <h1 className="text-xl font-semibold text-center mb-2">
                            Masuk ke Akun Anda
                        </h1>

                        <p className="text-sm text-netral-500 text-center mb-6">
                            Akses dashboard untuk melakukan skrining, memantau hasil,
                            dan melihat perkembangan secara terstruktur.
                        </p>

                        {/* Google Login */}
                        {/* <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            startIcon={<FcGoogle size={18} />}
                            className="w-full flex items-center justify-center text-sm gap-2 mb-6"
                            disabled
                        >
                            Masuk dengan Akun Google
                        </Button> */}

                        {/* Divider */}
                        {/* <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-netral-400"></div>
                            <span className="text-xs text-netral-500">
                                atau masuk dengan
                            </span>
                            <div className="flex-1 h-px bg-netral-400"></div>
                        </div> */}

                        {/* Status */}
                        {status && (
                            <div className="mb-4 text-sm text-green-600">
                                {status}
                            </div>
                        )}

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
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                error={errors.email}
                            />

                            <Input
                                label="Password"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                enablePasswordValidation={false}
                                error={errors.password}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-6"
                                disabled={processing}
                            >
                                Masuk
                            </Button>
                        </Form>
                    </div>

                    {/* Register */}
                    <p className="text-sm text-netral-600 mt-6">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="text-primary font-semibold hover:underline"
                        >
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>

                {/* Right */}
                <div className="hidden lg:flex items-center justify-center p-6">
                    <div className="w-full h-182 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={Illustration}
                            alt="Login"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
