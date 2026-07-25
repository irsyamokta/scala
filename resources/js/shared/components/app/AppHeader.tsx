import React, { useState, useRef, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { FiSidebar, FiUser, FiLogOut } from "react-icons/fi";

import { useSidebar } from "@/Context/SidebarContext";

type Props = {
    title: string;
};

const AppHeader: React.FC<Props> = ({ title }) => {
    const { toggleSidebar, toggleMobileSidebar } = useSidebar();
    const { auth }: any = usePage().props;

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-netral-100 border-b border-netral-300">

            <div className="flex items-center justify-between px-3 py-4">

                {/* LEFT */}
                <div className="flex items-center gap-4">

                    {/* Sidebar toggle */}
                    <button
                        onClick={handleToggle}
                        className="flex items-center justify-center w-10 h-10 border rounded-lg text-netral-600 hover:bg-netral-100"
                    >
                        <FiSidebar size={20} />
                    </button>

                    {/* Title */}
                    <h1 className="text-xl font-semibold text-netral-900">
                        {title}
                    </h1>
                </div>

                {/* RIGHT */}
                <div className="relative" ref={dropdownRef}>

                    {/* Avatar button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-netral-100"
                    >
                        <FiUser size={18} />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-3 w-68 bg-netral-100 border rounded-lg shadow-lg">

                            <div className="px-4 py-3 border-b text-sm text-netral-700">
                                {auth?.user?.name}
                            </div>

                            <Link
                                href="/profil"
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-netral-200"
                            >
                                <FiUser />
                                Profil Saya
                            </Link>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-netral-200 rounded-b-lg w-full"
                            >
                                <FiLogOut />
                                Keluar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
