import React, { useId } from "react";
import Button from "@/Components/ui/button/Button";

type RadioValue = string | number | boolean;

interface Option<T extends RadioValue> {
    label: string;
    value: T;
}

interface RadioButtonGroupProps<T extends RadioValue> {
    id?: string;
    label?: string;
    name: string;
    options: Option<T>[];
    value: T;
    height?: string;
    required?: boolean;
    optional?: boolean;
    disabled?: boolean;
    onChange: (value: T) => void;
}

export default function RadioButtonGroup<T extends RadioValue>({
    id,
    label,
    name,
    options,
    value,
    height = "h-14",
    required,
    optional,
    disabled,
    onChange,
}: RadioButtonGroupProps<T>) {

    const generatedId = useId();
    const baseId = id ?? generatedId;

    return (
        <div className="w-full space-y-3">
            {/* Label */}
            {label && (
                <label
                    htmlFor={baseId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-error-500">*</span>
                    )}
                    {!required && optional && (
                        <span className="ml-2 text-xs text-gray-400">
                            (Opsional)
                        </span>
                    )}
                </label>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                {options.map((opt) => {
                    const active = value === opt.value;

                    return (
                        <Button
                            key={String(opt.value)}
                            type="button"
                            variant={active ? "secondary" : "outline"}
                            disabled={disabled}
                            className={`
                                w-full
                                ${height ? height : "h-14"}
                                border
                                transition
                                ${active ? "border-primary" : "border-gray-300"}
                            `}
                            onClick={() => onChange(opt.value)}
                        >
                            {opt.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}