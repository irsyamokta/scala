import React, { useRef, useState, useEffect, useId } from "react";
import { LuClock } from "react-icons/lu";

interface TimeSegmentInputProps {
    id?: string;
    label?: string;
    hint?: string;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
    value?: string; // Format: "HH:MM" or ""
    onChange?: (val: string) => void;
    className?: string;
}

export default function TimeSegmentInput({
    id,
    label,
    hint,
    error,
    required = false,
    disabled = false,
    value = "",
    onChange,
    className = "",
}: TimeSegmentInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);

    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    // Sync from incoming value prop (e.g. "23:59")
    useEffect(() => {
        if (!value) {
            setHour("");
            setMinute("");
            return;
        }
        const [hh, mm] = value.split(":");
        setHour(hh ?? "");
        setMinute(mm ?? "");
    }, [value]);

    const emitChange = (newHour: string, newMinute: string) => {
        if (!newHour && !newMinute) {
            onChange?.("");
            return;
        }
        onChange?.(`${newHour}:${newMinute}`);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);

        // Jika digit pertama 3-9, otomatis ubah jadi 03-09 dan pindah ke menit
        if (val.length === 1 && parseInt(val, 10) >= 3) {
            const padded = `0${val}`;
            setHour(padded);
            emitChange(padded, minute);
            minuteRef.current?.focus();
            minuteRef.current?.select();
            return;
        }

        // Jika 2 digit, pastikan <= 23
        if (val.length === 2) {
            const num = parseInt(val, 10);
            const validHour = num > 23 ? "23" : val;
            setHour(validHour);
            emitChange(validHour, minute);
            minuteRef.current?.focus();
            minuteRef.current?.select();
            return;
        }

        setHour(val);
        emitChange(val, minute);
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);

        // Jika digit pertama 6-9, otomatis ubah jadi 06-09
        if (val.length === 1 && parseInt(val, 10) >= 6) {
            const padded = `0${val}`;
            setMinute(padded);
            emitChange(hour, padded);
            return;
        }

        // Jika 2 digit, pastikan <= 59
        if (val.length === 2) {
            const num = parseInt(val, 10);
            const validMinute = num > 59 ? "59" : val;
            setMinute(validMinute);
            emitChange(hour, validMinute);
            return;
        }

        setMinute(val);
        emitChange(hour, val);
    };

    const handleKeyDown = (
        segment: "hour" | "minute",
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (segment === "minute" && !minute) {
                e.preventDefault();
                hourRef.current?.focus();
                hourRef.current?.select();
            }
        } else if (e.key === ":" || e.key === "Enter" || e.key === "ArrowRight") {
            if (segment === "hour") {
                e.preventDefault();
                if (hour && hour.length === 1) {
                    const padded = `0${hour}`;
                    setHour(padded);
                    emitChange(padded, minute);
                }
                minuteRef.current?.focus();
                minuteRef.current?.select();
            }
        } else if (e.key === "ArrowLeft") {
            if (segment === "minute" && (e.currentTarget.selectionStart === 0 || !minute)) {
                e.preventDefault();
                hourRef.current?.focus();
                hourRef.current?.select();
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
                        if (!hour) hourRef.current?.focus();
                        else minuteRef.current?.focus();
                    }
                }}
            >
                <LuClock className="text-gray-400 shrink-0 mr-1" size={17} />

                {/* Hour Input */}
                <input
                    ref={hourRef}
                    id={inputId}
                    type="text"
                    inputMode="numeric"
                    placeholder="HH"
                    value={hour}
                    disabled={disabled}
                    onChange={handleHourChange}
                    onKeyDown={(e) => handleKeyDown("hour", e)}
                    onFocus={(e) => e.target.select()}
                    className="w-7 text-center bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium disabled:cursor-not-allowed"
                />

                <span className="text-gray-400 select-none">:</span>

                {/* Minute Input */}
                <input
                    ref={minuteRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={minute}
                    disabled={disabled}
                    onChange={handleMinuteChange}
                    onKeyDown={(e) => handleKeyDown("minute", e)}
                    onFocus={(e) => e.target.select()}
                    className="w-8 text-center bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 font-medium disabled:cursor-not-allowed"
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

