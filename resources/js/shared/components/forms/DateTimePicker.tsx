import { useEffect, useRef, useId, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { LuChevronDown } from "react-icons/lu";

type PickerVariant = "datetime" | "date-only" | "time-only";

interface DateTimePickerProps {
    id?: string;
    name?: string;
    variant?: PickerVariant;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    hint?: string;
    error?: string;
    className?: string;
}

export default function DateTimePicker({
    id,
    name,
    variant = "datetime",
    value,
    onChange,
    label,
    placeholder,
    required = false,
    disabled = false,
    hint,
    error,
    className = "",
}: DateTimePickerProps) {
    const genId      = useId();
    const inputId    = id || genId;
    const timeId     = useId();

    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);
    const dateFp  = useRef<flatpickr.Instance | null>(null);
    const timeFp  = useRef<flatpickr.Instance | null>(null);

    const [dateVal, setDateVal] = useState("");
    const [timeVal, setTimeVal] = useState("");
    const [touched, setTouched] = useState(false);

    const isDateOnly = variant === "date-only";
    const isTimeOnly = variant === "time-only";
    const isDatetime = variant === "datetime";
    const isInvalid  = required && touched && !value;

    /* ── Sync incoming value to local state ── */
    useEffect(() => {
        if (!value) {
            setDateVal("");
            // Set default time 00:00 untuk datetime variant
            setTimeVal(isDatetime ? "00:00" : "");
            return;
        }
        if (isDatetime) {
            const parts = value.split(" ");
            setDateVal(parts[0] ?? "");
            setTimeVal(parts[1] ?? "");
        } else if (isDateOnly) {
            setDateVal(value);
        } else {
            setTimeVal(value);
        }
    }, [value, variant]);

    const emit = (d: string, t: string) => {
        if (isDatetime)  onChange?.(d ? `${d} ${t || "00:00"}` : "");
        else if (isDateOnly) onChange?.(d);
        else             onChange?.(t);
    };

    /* ── Date flatpickr ── */
    useEffect(() => {
        if (isTimeOnly || !dateRef.current) return;
        dateFp.current?.destroy();
        dateFp.current = flatpickr(dateRef.current, {
            mode:              "single",
            static:            false,
            dateFormat:        "Y-m-d",
            monthSelectorType: "static",
            defaultDate:       dateVal || undefined,
            onChange: (_d, str) => {
                setTouched(true);
                setDateVal(str);
                emit(str, timeVal);
            },
        });
        return () => dateFp.current?.destroy();
    }, [variant]);

    useEffect(() => {
        if (dateFp.current) dateFp.current.setDate(dateVal || "", false);
    }, [dateVal]);

    /* ── Time flatpickr ── */
    useEffect(() => {
        if (isDateOnly || !timeRef.current) return;
        timeFp.current?.destroy();
        timeFp.current = flatpickr(timeRef.current, {
            mode:            "single",
            static:          false,
            enableTime:      true,
            noCalendar:      true,
            time_24hr:       true,
            minuteIncrement: 1,
            dateFormat:      "H:i",
            defaultDate:     timeVal || undefined,
            onChange: (_d, str) => {
                setTouched(true);
                setTimeVal(str);
                emit(dateVal, str);
            },
        });
        return () => timeFp.current?.destroy();
    }, [variant]);

    useEffect(() => {
        if (timeFp.current) timeFp.current.setDate(timeVal || "", false);
    }, [timeVal]);

    /* ── Styles ── */
    const border = isInvalid || error
        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
        : "border-gray-300 focus:border-primary focus:ring-primary/20";

    const inputClass = `h-11 w-full rounded-lg border px-4 py-2.5 text-sm
        bg-transparent text-gray-800 placeholder:text-gray-400
        focus:outline-none focus:ring-1 cursor-pointer
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${border}`;

    return (
        <div className={`w-full ${className}`}>
            {/* Label utama */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="ml-1 text-error-500">*</span>}
                </label>
            )}

            <div className="flex gap-3">

                {/* Date input */}
                {!isTimeOnly && (
                    <div className="flex-1 min-w-0 space-y-1">
                        {isDatetime && (
                            <p className="text-xs font-medium text-gray-500">Tanggal</p>
                        )}
                        <div className="relative">
                            <input
                                id={inputId}
                                name={isDateOnly ? name : undefined}
                                ref={dateRef}
                                value={dateVal}
                                readOnly
                                disabled={disabled}
                                placeholder={isDateOnly
                                    ? (placeholder ?? "Pilih tanggal...")
                                    : "Pilih tanggal..."}
                                className={`${inputClass} pr-9`}
                            />
                            {/* Chevron di dalam input */}
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            >
                                <LuChevronDown size={16} />
                            </span>
                        </div>
                    </div>
                )}

                {/* Time input */}
                {!isDateOnly && (
                    <div className={`space-y-1 ${isDatetime ? "w-24 shrink-0" : "flex-1"}`}>
                        {isDatetime && (
                            <p className="text-xs font-medium text-gray-500">Waktu</p>
                        )}
                        <input
                            id={isTimeOnly ? inputId : timeId}
                            name={isTimeOnly ? name : undefined}
                            ref={timeRef}
                            value={timeVal}
                            readOnly
                            disabled={disabled || (isDatetime && !dateVal)}
                            placeholder={isTimeOnly
                                ? (placeholder ?? "Pilih waktu...")
                                : "--:--"}
                            className={inputClass}
                        />
                    </div>
                )}
            </div>

            {/* Hint / Error */}
            {(hint || isInvalid || error) && (
                <p className={`mt-1 text-xs ${isInvalid || error ? "text-error-500" : "text-gray-500"}`}>
                    {error ?? (isInvalid ? "Field ini wajib diisi" : hint)}
                </p>
            )}
        </div>
    );
}
