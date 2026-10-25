import Logo from "@assets/svg/logo-color.svg";

import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function AppFooter() {
    return (
        <footer className="bg-netral-100">
            <div className="px-6 lg:px-20 py-14 flex flex-col lg:flex-row justify-between gap-12">

                {/* Left Section */}
                <div className="max-w-lg space-y-8">
                    <img src={Logo} alt="Scala Logo" className="w-48" />

                    <p className="text-netral-600 tracking-wide leading-relaxed">
                        Platform skrining kesehatan mental berbasis instrumen
                        terstandarisasi yang dirancang untuk mendukung deteksi
                        dini dan monitoring profesional secara lebih terstruktur.
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-3 text-sm text-netral-600">
                        <div className="flex items-center gap-3">
                            <FaWhatsapp className="text-netral-600" size={18} />
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                className="hover:text-primary"
                            >
                                +62 812-3456-7890
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineMail className="text-netral-600" size={18} />
                            <a
                                href="mailto:info@scala.id"
                                className="hover:text-primary"
                            >
                                info@scala.id
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="grid grid-cols-2 gap-12 text-sm">

                    {/* Evaluasi Skrining */}
                    <div>
                        <h3 className="font-semibold text-netral-900 mb-4">
                            Evaluasi Skrining
                        </h3>

                        <ul className="space-y-4 text-netral-600">
                            <li>
                                <a href="/skrining" className="hover:text-primary">
                                    Tes Skrining Siswa
                                </a>
                            </li>
                            <li>
                                <a href="/login" className="hover:text-primary">
                                    Masuk Akun
                                </a>
                            </li>
                            <li>
                                <a href="/register" className="hover:text-primary">
                                    Daftar Akun
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h3 className="font-semibold text-netral-900 mb-4">
                            Navigasi
                        </h3>

                        <ul className="space-y-4 text-netral-600">
                            <li>
                                <a href="/" className="hover:text-primary">
                                    Tentang
                                </a>
                            </li>
                            <li>
                                <a href="/#sdq-srq" className="hover:text-primary">
                                    SDQ & SRQ
                                </a>
                            </li>
                            <li>
                                <a href="/#psikolog" className="hover:text-primary">
                                    Psikolog
                                </a>
                            </li>
                            <li>
                                <a href="/uji-coba" className="hover:text-primary">
                                    Uji Coba
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-netral-300" />

            {/* Copyright */}
            <div className="text-center py-6 text-sm text-netral-600">
                © {new Date().getFullYear()}. Didampingi oleh psikolog profesional.
            </div>
        </footer>
    );
}
