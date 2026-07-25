import React from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";
export type AlertSize = "sm" | "md" | "lg";

interface AlertBannerProps {
    title?: string;
    children: React.ReactNode;
    variant?: AlertVariant;
    size?: AlertSize;
    className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
    info: "bg-blue-50 border-blue-300 text-blue-900",
    success: "bg-green-50 border-green-300 text-green-900",
    warning: "bg-yellow-50/50 border-yellow-500 text-yellow-900",
    danger: "bg-red-50 border-red-300 text-red-900",
};

const sizeStyles: Record<AlertSize, string> = {
    sm: "text-sm px-3 py-3",
    md: "text-base px-4 py-3",
    lg: "text-lg px-5 py-4",
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
    title,
    children,
    variant = "info",
    size = "md",
    className = "",
}) => {
    return (
        <div
            role="alert"
            className={`w-full border rounded-lg ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                {title && (
                    <span className="font-semibold leading-tight">{title}</span>
                )}
                <div className="leading-relaxed font-medium">{children}</div>
            </div>
        </div>
    );
};

export default AlertBanner;
