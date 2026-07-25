import React from "react";

type InstructionCardProps = {
    step: string;
    title: string;
    description: string;
};

const InstructionCard: React.FC<InstructionCardProps> = ({
    step,
    title,
    description,
}) => {
    return (
        <div className="rounded-xl border border-netral-300 bg-netral-100 p-4 transition hover:shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-primary">
                {step}
            </div>

            <h3 className="font-semibold text-netral-900">{title}</h3>

            <p className="mt-2 text-sm text-netral-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default InstructionCard;