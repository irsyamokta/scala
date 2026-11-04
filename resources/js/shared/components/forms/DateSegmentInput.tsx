import React, { useRef, useState, useEffect, useId } from "react";
import { LuCalendar } from "react-icons/lu";

interface DateSegmentInputProps {
    id?: string;
    label?: string;
    hint?: string;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    onChange?: (val: string) => void;
    className?: string;
}

export default function DateSegmentInput({
    id,
    label,
    hint,
    error,
    required = false,
    disabled = false,
    value = "",
    onChange,
    className = "",
}: DateSegmentInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        if (!value) {
            setDay("");
            setMonth("");
            setYear("");
            return;
        }
        const [d, m, y] = value.split("/");
        setDay(d ?? "");
        setMonth(m ?? "");
        setYear(y ?? "");
    }, [value]);

    const emitChange = (newDay: string, newMonth: string, newYear: string) => {
        if (!newDay && !newMonth && !newYear) {
            onChange?.("");
            return;
        }
        onChange?.(`${newDay}/${newMonth}/${newYear}`);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);

        if (val.length === 1 && parseInt(val, 10) >= 4) {
            const padded = `0${val}`;
            setDay(padded);
            emitChange(padded, month, year);
            monthRef.current?.focus();
            monthRef.current?.select();
            return;
        }

        if (val.length === 2) {
            const num = parseInt(val, 10);
            const validDay = num > 31 ? "31" : num === 0 ? "01" : val;
            setDay(validDay);
            emitChange(validDay, month, year);
            monthRef.current?.focus();
            monthRef.current?.select();
            return;
        }

        setDay(val);
        emitChange(val, month, year);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);

        if (val.length === 1 && parseInt(val, 10) >= 2) {
            const padded = `0${val}`;
            setMonth(padded);
            emitChange(day, padded, year);
            yearRef.current?.focus();
            yearRef.current?.select();
            return;
        }

        if (val.length === 2) {
            const num = parseInt(val, 10);
            const validMonth = num > 12 ? "12" : num === 0 ? "01" : val;
            setMonth(validMonth);
            emitChange(day, validMonth, year);
            yearRef.current?.focus();
            yearRef.current?.select();
            return;
        }

        setMonth(val);
        emitChange(day, val, year);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
        setYear(val);
        emitChange(day, month, val);
    };

    const handleKeyDown = (
        segment: "day" | "month" | "year",
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (segment === "year" && !year) {
                e.preventDefault();
                monthRef.current?.focus();
                monthRef.current?.select();
            } else if (segment === "month" && !month) {
                e.preventDefault();
                dayRef.current?.focus();
                dayRef.current?.select();
            }
        } else if (e.key === "/" || e.key === "." || e.key === "-" || e.key === "ArrowRight") {
            if (segment === "day") {
                e.preventDefault();
                if (day && day.length === 1) {
                    const padded = `0${day}`;
                    setDay(padded);
                    emitChange(padded, month, year);
                }
                monthRef.current?.focus();
                monthRef.current?.select();
            } else if (segment === "month") {
                e.preventDefault();
                if (month && month.length === 1) {
                    const padded = `0${month}`;
                    setMonth(padded);
                    emitChange(day, padded, year);
                }
                yearRef.current?.focus();
                yearRef.current?.select();
            }
        } else if (e.key === "ArrowLeft") {
            if (segment === "year" && (e.currentTarget.selectionStart === 0 || !year)) {
                e.preventDefault();
                monthRef.current?.focus();
                monthRef.current?.select();
            } else if (segment === "month" && (e.currentTarget.selectionStart === 0 || !month)) {
                e.preventDefault();
                dayRef.current?.focus();
                dayRef.current?.select();
            }
        }
    };

    const stateClasses = disabled
        ? "text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
        : error
        ? "border-error-500 focus-within:border-error-300 focus-within:ring-1 focus-within:ring-error-500/20"
        : "bg-white text-gray-800 border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20";

    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}

            <div
                className={`h-11 w-full rounded-lg border px-3 flex items-center gap-1.5 text-sm transition-all duration-200 ${stateClasses}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        if (!day) dayRef.current?.focus();
                        else if (!month) monthRef.current?.focus();
                        else yearRef.current?.focus();
                    }
                }}
            >
                <LuCalendar className="text-gray-400 shrink-0 mr-1" size={17} />

                {/* Day Input */}
                <input
                    ref={dayRef}
                    id={inputId}
                    type="text"
                    inputMode="numeric"
                    placeholder="DD"
                    value={day}
                    disabled={disabled}
                    onChange={handleDayChange}
                    onKeyDown={(e) => handleKeyDown("day", e)}
                    onFocus={(e) => e.target.select()}
                    className="w-7 text-center bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium disabled:cursor-not-allowed"
                />

                <span className="text-gray-400 select-none">/</span>

                {/* Month Input */}
                <input
                    ref={monthRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={month}
                    disabled={disabled}
                    onChange={handleMonthChange}
                    onKeyDown={(e) => handleKeyDown("month", e)}
                    onFocus={(e) => e.target.select()}
                    className="w-8 text-center bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium disabled:cursor-not-allowed"
                />

                <span className="text-gray-400 select-none">/</span>

                {/* Year Input */}
                <input
                    ref={yearRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={year}
                    disabled={disabled}
                    onChange={handleYearChange}
                    onKeyDown={(e) => handleKeyDown("year", e)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 text-center bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium disabled:cursor-not-allowed"
                />
            </div>

            {(hint || error) && (
                <p className={`text-xs ${error ? "text-error-500" : "text-gray-500"}`}>
                    {error ?? hint}
                </p>
            )}
        </div>
    );
}

