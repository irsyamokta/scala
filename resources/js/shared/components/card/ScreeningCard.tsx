import React from "react";

import Button from "@/shared/components/ui/button/Button";

import { PiCheckSquareOffset } from "react-icons/pi";
import Decorative from "@assets/svg/bg-decoration-2.svg"

type ScreeningCardProps = {
    title?: string;
    highlight?: string;
    description?: string;
    info?: string;
    buttonText?: string;
    onClick?: () => void;
};

const ScreeningCard: React.FC<ScreeningCardProps> = ({
    title = "Tes Skrining",
    highlight = "SDQ",
    description = "Tes berisi 20 soal untuk dijawab",
    info = "Tes untuk anak-anak & remaja (4–17 tahun)",
    buttonText = "Menuju Tes",
    onClick,
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-netral-100 border border-netral-300 p-4 lg:p-8 text-center hover:shadow-sm">

            {/* Content */}
            <div className="relative z-10">
                <h2 className="text-2xl font-semibold text-netral-900">
                    {title} <span className="text-teal-600">{highlight}</span>
                </h2>

                <p className="text-sm md:text-base mt-2 text-netral-700">{description}</p>

                {/* Badge */}
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-secondary px-3 2xsm:px-4 py-2 text-sm text-primary">
                    <PiCheckSquareOffset size={20} className="text-primary"/>
                    {info}
                </div>

                {/* Button */}
                <div className="mt-8">
                    <Button
                        size="lg"
                        onClick={onClick}
                        className="text-sm"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>

            {/* Decorative wave */}
            <div>
                <img src={Decorative} alt="" className="absolute top-36 lg:top-40 right-1 rotate-175 hidden sm:block" />
            </div>
        </div>
    );
};

export default ScreeningCard;