import { PropsWithChildren } from "react";
import { usePage } from "@inertiajs/react";

import Backdrop from "@/Layouts/Backdrop";
import { SidebarProvider, useSidebar } from "@/Context/SidebarContext";

import AppHeader from "@/shared/components/app/AppHeader";
import AppSidebar from "@/shared/components/app/AppSidebar";

import { getSidebarConfig } from "@/config/sidebar.config";

function LayoutContent({ children, title }: PropsWithChildren<{ title: string }>) {
    const { auth }: any = usePage().props;
    const role = auth?.user?.role;

    const navItems = getSidebarConfig(role);
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex bg-netral-200">
            <div>
                <AppSidebar sections={navItems} />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ${isExpanded || isHovered ? "lg:ml-64" : "lg:ml-24"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AppHeader title={title} />
                <div className="py-4 md:py-6 px-3 mx-auto max-w-(--breakpoint-2xl)">
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
