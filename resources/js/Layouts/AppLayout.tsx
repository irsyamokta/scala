import { PropsWithChildren } from "react";
import AppNavbar from "@/Components/app/AppNavbar";

interface AppLayoutProps {
    className?: string;
    navbar?: React.ComponentProps<typeof AppNavbar>;
}

const AppLayout: React.FC<PropsWithChildren<AppLayoutProps>> = ({
    children,
    className,
    navbar,
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <AppNavbar {...navbar} />

            {/* Main Content */}
            <main className={`flex-1 overflow-hidden ${className ?? ""} pt-20`}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
