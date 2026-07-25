import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

type UseSearchOptions<T> = {
    routeName: string;
    initialFilters?: T;
    debounce?: number;
    preserveState?: boolean;
};

export function useSearch<T extends Record<string, any>>(
    options: UseSearchOptions<T>
) {
    const {
        routeName,
        initialFilters = {} as T,
        debounce = 400,
        preserveState = true,
    } = options;

    const [filters, setFilters] = useState<T>(initialFilters);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);

    const setFilter = <K extends keyof T>(key: K, value: T[K]) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {

            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) =>
                        value !== "" &&
                        value !== null &&
                        !(Array.isArray(value) && value.length === 0)
                )
            );

            router.get(route(routeName), cleanedFilters, {
                preserveState,
                preserveScroll: true,
                replace: true,
            });

        }, debounce);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [filters]);

    return {
        filters,
        setFilters,
        setFilter,
    };
}
