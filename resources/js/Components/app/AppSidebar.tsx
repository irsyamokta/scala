import { Link, usePage } from "@inertiajs/react";
import { HiChevronDown, HiDotsHorizontal } from "react-icons/hi";
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

const AppSidebar: React.FC<AppSidebarProps> = ({ sections }) => {
    const { url, props } = usePage<any>();

    const subjectId = props?.auth.subjects[0]?.id;

    const {
        isExpanded,
        isHovered,
        isMobileOpen,
        openSubmenu,
        toggleSubmenu,
        setIsHovered,
    } = useSidebar();

    const expanded = isMobileOpen || isExpanded || isHovered;

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
        return children.some((child) =>
            isActive(resolvePath(child))
        );
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

                                const childActive = isChildActive(item.children);
                                const parentActive =
                                    isActive(itemPath) || childActive;

                                const submenuOpen =
                                    openSubmenu === item.name || childActive;

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
                                                <span className="text-lg">
                                                    {item.icon}
                                                </span>

                                                {expanded && item.name}
                                            </Link>
                                        )}

                                        {/* MENU WITH CHILD */}
                                        {item.children && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        toggleSubmenu(item.name)
                                                    }
                                                    className={`
                                                    flex w-full items-center
                                                    ${expanded
                                                            ? "justify-between px-3"
                                                            : "justify-center"
                                                        }
                                                    py-2 text-sm rounded-md
                                                    ${parentActive
                                                            ? "bg-secondary text-primary"
                                                            : "hover:bg-netral-200"
                                                        }
                                                `}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {item.icon}
                                                        {expanded && item.name}
                                                    </span>

                                                    {expanded && (
                                                        <HiChevronDown
                                                            className={`transition ${submenuOpen
                                                                    ? "rotate-180"
                                                                    : ""
                                                                }`}
                                                        />
                                                    )}
                                                </button>

                                                {submenuOpen && expanded && (
                                                    <ul className="ml-7 mt-1 space-y-1">
                                                        {item.children.map(
                                                            (child) => {
                                                                const childPath =
                                                                    resolvePath(
                                                                        child
                                                                    );

                                                                return (
                                                                    <li key={child.name}>
                                                                        <Link
                                                                            href={childPath}
                                                                            className={`
                                                                            block px-3 py-2 text-sm rounded-md
                                                                            ${isActive(
                                                                                childPath
                                                                            )
                                                                                    ? "bg-secondary text-primary"
                                                                                    : "hover:bg-netral-200"
                                                                                }
                                                                        `}
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
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
        </aside>
    );
};

export default AppSidebar;