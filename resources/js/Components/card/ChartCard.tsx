import React from "react";

type ChartCardProps = {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    isMobile?: boolean;
};

const ChartCard: React.FC<ChartCardProps> = ({ title, children, action, isMobile = false }) => {
    return (
        <div className="w-full h-full bg-netral-100 rounded-2xl border border-netral-300 p-6">
            <div className={`flex ${isMobile ? "flex-col md:flex-row md:items-center md:justify-between" : "flex-row items-center justify-between"} gap-2 mb-6`}>
                <h3 className="text-lg font-semibold text-netral-900">{title}</h3>

                {action && <div>{action}</div>}
            </div>

            <div className="w-full">{children}</div>
        </div>
    );
};

export default ChartCard;
