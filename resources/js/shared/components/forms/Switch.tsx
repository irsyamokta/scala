import { useState } from "react";

interface SwitchProps {
    label?: string;
    checked?: boolean;
    startLabel?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    color?: "primary" | "netral";
}

const Switch: React.FC<SwitchProps> = ({
    label,
    checked: defaultChecked = false,
    startLabel,
    disabled = false,
    onChange,
    color = "primary",
}) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleToggle = () => {
        if (disabled) return;
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        if (onChange) {
            onChange(newCheckedState);
        }
    };

    const switchColors =
        color === "primary"
            ? {
                background: isChecked
                    ? "bg-secondary "
                    : "bg-netral-200 dark:bg-white/10",
                knob: isChecked
                    ? "translate-x-full bg-primary"
                    : "translate-x-0 bg-netral-500",
            }
            : {
                background: isChecked
                    ? "bg-netral-800 dark:bg-white/10"
                    : "bg-netral-200 dark:bg-white/10",
                knob: isChecked
                    ? "translate-x-full bg-white"
                    : "translate-x-0 bg-white",
            };

    return (
        <label
            className={`flex ${startLabel ? "flex-row-reverse" : "flex-row"} cursor-pointer select-none items-center gap-3 text-sm font-medium ${disabled ? "text-netral-400" : "text-netral-600 dark:text-netral-400"
                }`}
            onClick={handleToggle} // Toggle when the label itself is clicked
        >
            <div className="relative">
                <div
                    className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${disabled
                        ? "bg-netral-100 pointer-events-none dark:bg-netral-800"
                        : switchColors.background
                        }`}
                ></div>
                <div
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
                ></div>
            </div>
            {label}
        </label>
    );
};

export default Switch;
