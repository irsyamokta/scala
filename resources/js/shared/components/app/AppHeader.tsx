import React, { useState, useRef, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { FiSidebar, FiUser, FiLogOut, FiMoon, FiSun, FiBell } from "react-icons/fi";

import { useSidebar } from "@/Context/SidebarContext";

type Props = {
    title: string;
    onToggleDarkMode?: () => void;
    isDarkMode?: boolean;
    onToggleNotifications?: () => void;
    notificationCount?: number;
};

const AppHeader: React.FC<Props> = ({
    title,
    onToggleDarkMode,
    isDarkMode = false,
    onToggleNotifications,
    notificationCount = 0,
}) => {
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
                    {title && (
                        <h1 className="text-xl font-semibold text-netral-900">
                            {title}
                        </h1>
                    )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">

                    {/* Dark mode toggle */}
                    <button
                        onClick={onToggleDarkMode}
                        title={isDarkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
                        className="hidden items-center justify-center w-10 h-10 border rounded-lg text-netral-600 hover:bg-netral-200 transition"
                    >
                        {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                    </button>

                    {/* Notification bell */}
                    <button
                        onClick={onToggleNotifications}
                        title="Notifikasi"
                        className="relative hidden items-center justify-center w-10 h-10 border rounded-lg text-netral-600 hover:bg-netral-200 transition"
                    >
                        <FiBell size={18} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                                    {notificationCount > 9 ? "9+" : notificationCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>

                    {/* Avatar button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-netral-200"
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
            </div>
        </header>
    );
};

export default AppHeader;
