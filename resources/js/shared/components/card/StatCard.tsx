import React from "react";
import CountUp from "react-countup";

type StatCardProps = {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    const isNumber = typeof value === "number";

    return (
        <div className="w-full rounded-2xl bg-netral-100 border border-netral-300 p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <h3 className="text-netral-900 text-lg font-semibold">{title}</h3>

                {icon && (
                    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-secondary text-primary">
                        {icon}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <span
                    className={`font-semibold text-netral-900 ${isNumber ? "text-5xl" : "text-3xl"
                        }`}
                >
                    {isNumber ? (
                        <CountUp
                            end={value}
                            duration={0.5}
                            separator=","
                            easingFn={(t, b, c, d) => c * (t /= d) * t + b}
                        />
                    ) : (
                        value
                    )}
                </span>
            </div>
        </div>
    );
};

export default StatCard;
