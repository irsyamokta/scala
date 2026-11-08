import { PropsWithChildren, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { FiAlertCircle, FiLogOut } from "react-icons/fi";

import Backdrop from "@/Layouts/Backdrop";
import { SidebarProvider, useSidebar } from "@/Context/SidebarContext";

import AppHeader from "@/shared/components/app/AppHeader";
import AppSidebar from "@/shared/components/app/AppSidebar";

import { getSidebarConfig } from "@/config/sidebar.config";
import { PageProps } from "@/types";

function LayoutContent({ children, title }: PropsWithChildren<{ title: string }>) {
    const { auth, flash } = usePage<PageProps>().props;
    const role = auth?.user?.role;

    const navItems = getSidebarConfig(role);
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error)   toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    return (
        <div className="min-h-screen xl:flex bg-netral-200">
            <div>
                <AppSidebar sections={navItems} />
                <Backdrop />
            </div>
            <div
                className={`flex-1 min-w-0 transition-all duration-300 ${isExpanded || isHovered ? "lg:ml-64" : "lg:ml-24"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AppHeader title={title} />

                {/* Impersonation Banner */}
                {auth?.is_impersonating && (
                    <div className="bg-amber-500 text-white px-4 md:px-6 py-2.5 flex items-center justify-between gap-3 text-sm font-medium shadow-sm">
                        <div className="flex items-center gap-2">
                            <FiAlertCircle className="text-amber-100 shrink-0 text-lg" />
                            <span>
                                Anda sedang masuk sebagai <strong>{auth?.user?.name}</strong> ({auth?.user?.email}).
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.post(route("impersonate.leave"))}
                            className="inline-flex items-center gap-1.5 bg-white text-amber-900 hover:bg-amber-50 px-3 py-3 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
                        >
                            <FiLogOut size={14} />
                            Keluar
                        </button>
                    </div>
                )}
                <div className="p-4 md:p-6 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DashboardLayout: React.FC<PropsWithChildren<{ title: string }>> = ({
    children,
    title,
}) => {
    return (
        <SidebarProvider>
            <LayoutContent title={title}>
                {children}
            </LayoutContent>
        </SidebarProvider>
    );
};

export default DashboardLayout;
