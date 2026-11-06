import { useEffect, useRef, useState } from "react";
import Input from "@/shared/components/forms/InputField";
import Checkbox from "@/shared/components/forms/Checkbox";
import Select from "@/shared/components/forms/Select";
import { FiSearch, FiFilter, FiCheck } from "react-icons/fi";

type SelectOption = {
    value: string | number;
    label: string;
};

type FilterOption = {
    value: string;
    label: string;
};

type FilterBarProps = {
    search?: {
        value: string;
        placeholder?: string;
        onChange: (value: string) => void;
    };

    select?: {
        value: string;
        options: SelectOption[];
        placeholder?: string;
        onChange: (value: string) => void;
    };

    filter?: {
        label?: string;
        value: string[];
        options: FilterOption[];
        onChange: (value: string[]) => void;
    };

    filters?: {
        label: string;
        value: string[];
        options: FilterOption[];
        onChange: (value: string[]) => void;
    }[];

    className?: string;
};

export default function FilterBar({
    search,
    select,
    filter,
    filters,
    className = "",
}: FilterBarProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleFilter = (value: string) => {
        if (!filter) return;

        const exists = filter.value.includes(value);

        if (exists) {
            filter.onChange(filter.value.filter((v) => v !== value));
        } else {
            filter.onChange([...filter.value, value]);
        }
    };

    return (
        <div
            className={`flex items-center gap-2 w-full ${className}`}
        >
            {/* SEARCH */}
            {search && (
                <Input
                    type="text"
                    startIcon={<FiSearch />}
                    placeholder={search.placeholder ?? "Cari..."}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    className="w-full rounded-lg border-netral-300 text-sm"
                />
            )}

            {/* SELECT */}
            {select && (
                <Select
                    value={select.value}
                    options={select.options}
                    placeholder={select.placeholder}
                    onChange={(value) => select.onChange(value as string)}
                    className="w-48 rounded-lg border-netral-300 text-sm"
                />
            )}

            {/* FILTER DROPDOWN */}
            {(filters || filter) && (
                <div className="relative" ref={ref}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center w-11 h-11 rounded-lg bg-netral-200 hover:bg-netral-300"
                    >
                        <FiFilter size={18} />
                    </button>

                    {open && (
                        <div className="absolute z-50 right-0 mt-2 w-64 bg-netral-100 border border-netral-300 rounded-xl shadow-lg p-4 space-y-4 max-h-[80vh] overflow-y-auto">

                            {/* MULTI GROUP */}
                            {filters ? (
                                filters.map((group) => (
                                    <div key={group.label}>
                                        <p className="text-sm font-semibold text-netral-900 mb-4">
                                            {group.label}
                                        </p>

                                        <div className="space-y-2">
                                            {group.options.map((option) => {
                                                const checked = group.value.includes(option.value);

                                                return (
                                                    <Checkbox
                                                        key={option.value}
                                                        checked={checked}
                                                        onChange={() => {
                                                            const exists = group.value.includes(option.value);

                                                            if (exists) {
                                                                group.onChange(group.value.filter(v => v !== option.value));
                                                            } else {
                                                                group.onChange([...group.value, option.value]);
                                                            }
                                                        }}
                                                        label={option.label}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <div className="border-t mt-3"></div>
                                    </div>
                                ))
                            ) : (
                                /* SINGLE (OLD) */
                                <div>
                                    {/* Header */}
                                    {filter?.label && (
                                        <>
                                            <p className="text-sm font-semibold text-netral-900 mb-4">
                                                {filter.label}
                                            </p>
                                        </>
                                    )}

                                    {/* Options */}
                                    <div className="space-y-2">
                                        {filter!.options.map((option) => {
                                            const checked = filter!.value.includes(option.value);

                                            return (
                                                <Checkbox
                                                    key={option.value}
                                                    checked={checked}
                                                    onChange={() => toggleFilter(option.value)}
                                                    label={option.label}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
