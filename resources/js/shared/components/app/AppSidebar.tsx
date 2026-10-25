import { useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { HiChevronDown, HiDotsHorizontal, HiChevronUp } from "react-icons/hi";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useSidebar } from "@/Context/SidebarContext";

type MenuContext = {
    subjectId?: string;
};

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    children?: NavItem[];
    buildPath?: (ctx: MenuContext) => string;
};

type SidebarSection = {
    title: string;
    items: NavItem[];
};

type AppSidebarProps = {
    sections: SidebarSection[];
};

/** Tentukan apakah menu item tertentu perlu badge notifikasi */
function resolveNotifCount(itemPath: string | undefined, notifications: any): number {
    if (!itemPath || !notifications) return 0;
    if (itemPath === "/batch") {
        const count = (notifications.pending_analysis ?? 0) + (notifications.batch_unassigned ?? 0);
        return count > 0 ? count : 0;
    }
    return 0;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ sections }) => {
    const { url, props } = usePage<any>();

    const subjectId = props?.auth.subjects?.[0]?.id;
    const notifications = props?.auth?.notifications ?? {};
    const user = props?.auth?.user;

    const {
        isExpanded,
        isHovered,
        isMobileOpen,
        openSubmenu,
        toggleSubmenu,
        setIsHovered,
    } = useSidebar();

    const expanded = isMobileOpen || isExpanded || isHovered;

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const resolvePath = (item: NavItem): string => {
        if (item.buildPath) {
            return item.buildPath({ subjectId });
        }
        return item.path || "#";
    };

    const isActive = (path?: string) => {
        if (!path) return false;
        const cleanUrl = url.split("?")[0];
        return cleanUrl === path || cleanUrl.startsWith(path + "/");
    };

    const isChildActive = (children?: NavItem[]) => {
        if (!children) return false;
        return children.some((child) => isActive(resolvePath(child)));
    };

    return (
        <aside
            className={`
            fixed top-0 left-0 h-screen z-50 bg-netral-100 border-r flex flex-col
            transition-all duration-300
            ${isMobileOpen ? "w-64" : expanded ? "w-64" : "w-24"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
        `}
            onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
            onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
        >
            {/* Logo */}
            <div className="flex items-center px-4 py-5 border-b gap-1">
                <h1 className="font-bold text-primary text-2xl">
                    Sca<span className="text-netral-900">la</span>
                </h1>

                {expanded && (
                    <span className="text-2xl font-semibold">
                        Dashboard
                    </span>
                )}
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
                {sections.map((section) => (
                    <div key={section.title}>
                        {expanded ? (
                            <p className="text-sm font-medium text-netral-600 mb-2 px-2">
                                {section.title}
                            </p>
                        ) : (
                            <div className="flex justify-center mb-2">
                                <HiDotsHorizontal className="text-netral-700/70" />
                            </div>
                        )}

                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const itemPath = resolvePath(item);
                                const notifCount = resolveNotifCount(item.path, notifications);

                                const childActive = isChildActive(item.children);
                                const parentActive = isActive(itemPath) || childActive;
                                const submenuOpen = openSubmenu === item.name || childActive;

                                return (
                                    <li key={item.name}>
                                        {/* SINGLE MENU */}
                                        {!item.children && (
                                            <Link
                                                href={itemPath}
                                                className={`
                                                flex items-center ${expanded
                                                        ? "gap-3 px-3 justify-start"
                                                        : "justify-center"
                                                    }
                                                py-2 rounded-md text-sm
                                                ${parentActive
                                                        ? "bg-secondary text-primary"
                                                        : "hover:bg-secondary"
                                                    }
                                            `}
                                            >
                                                <span className="relative text-lg">
                                                    {item.icon}
                                                    {notifCount > 0 && !expanded && (
                                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                                                            {notifCount > 9 ? "9+" : notifCount}
                                                        </span>
                                                    )}
                                                </span>

                                                {expanded && (
                                                    <span className="flex flex-1 items-center justify-between">
                                                        {item.name}
                                                        {notifCount > 0 && (
                                                            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                                                {notifCount > 99 ? "99+" : notifCount}
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </Link>
                                        )}

                                        {/* MENU WITH CHILD */}
                                        {item.children && (
                                            <>
                                                <button
                                                    onClick={() => toggleSubmenu(item.name)}
                                                    className={`
                                                    flex w-full items-center
                                                    ${expanded ? "justify-between px-3" : "justify-center"}
                                                    py-2 text-sm rounded-md
                                                    ${parentActive ? "bg-secondary text-primary" : "hover:bg-netral-200"}
                                                `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {item.icon}
                                                        {expanded && item.name}
                                                    </span>

                                                    {expanded && (
                                                        <HiChevronDown
                                                            className={`transition ${submenuOpen ? "rotate-180" : ""}`}
                                                        />
                                                    )}
                                                </button>

                                                {submenuOpen && expanded && (
                                                    <ul className="ml-7 mt-1 space-y-1">
                                                        {item.children.map((child) => {
                                                            const childPath = resolvePath(child);
                                                            return (
                                                                <li key={child.name}>
                                                                    <Link
                                                                        href={childPath}
                                                                        className={`
                                                                        block px-3 py-2 text-sm rounded-md
                                                                        ${isActive(childPath)
                                                                                ? "bg-secondary text-primary"
                                                                                : "hover:bg-netral-200"
                                                                            }
                                                                    `}
                                                                    >
                                                                        {child.name}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Profile */}
            <div className="border-t px-3 py-3 relative" ref={profileRef}>
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`
                        flex w-full items-center rounded-md py-2 px-2 hover:bg-netral-200 transition
                        ${expanded ? "gap-3 justify-between" : "justify-center"}
                    `}
                >
                    <div className={`flex items-center ${expanded ? "gap-3" : ""}`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm border border-primary/20">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>

                        {expanded && (
                            <div className="text-left min-w-0">
                                <p className="text-sm font-semibold text-netral-900 truncate max-w-32">
                                    {user?.name ?? "Pengguna"}
                                </p>
                                <p className="text-xs text-netral-500 truncate max-w-32">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                        )}
                    </div>

                    {expanded && (
                        <HiChevronUp
                            className={`flex-shrink-0 text-netral-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                        />
                    )}
                </button>

                {/* Dropdown (ke atas) */}
                {profileOpen && (
                    <div className={`
                        absolute bottom-full mb-2 bg-netral-100 border rounded-lg shadow-lg z-50
                        ${expanded ? "left-3 right-3" : "left-1/2 -translate-x-1/2 w-52"}
                    `}>
                        <div className="px-4 py-3 border-b">
                            <p className="text-sm font-semibold text-netral-900 truncate">{user?.name}</p>
                            <p className="text-xs text-netral-500 truncate">{user?.email}</p>
                        </div>

                        <Link
                            href="/profil"
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-netral-200"
                            onClick={() => setProfileOpen(false)}
                        >
                            <FiUser size={15} />
                            Profil Saya
                        </Link>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-netral-200 rounded-b-lg w-full"
                            onClick={() => setProfileOpen(false)}
                        >
                            <FiLogOut size={15} />
                            Keluar
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AppSidebar;
