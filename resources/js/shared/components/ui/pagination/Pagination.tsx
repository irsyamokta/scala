import { router } from "@inertiajs/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    filters: Record<string, any>;
    routeName: string;
    routeParams?: Record<string, any>;
    className?: string;
}

export default function Pagination({
    links,
    filters,
    routeName,
    routeParams,
    className = "",
}: PaginationProps) {
    if (!links || links.length <= 3) return null;

    const rawPages = links.slice(1, -1);
    const activeItem = rawPages.find((p) => p.active);
    const currentPage = activeItem ? parseInt(activeItem.label, 10) : 1;

    const numericPages = rawPages
        .map((p) => parseInt(p.label, 10))
        .filter((n) => !isNaN(n));
    const lastPage = numericPages.length > 0 ? Math.max(...numericPages) : 1;

    if (lastPage <= 1) return null;

    const navigateToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;

        router.get(
            routeParams ? route(routeName, routeParams) : route(routeName),
            { ...filters, page },
            { preserveState: true }
        );
    };

    const getVisiblePages = (current: number, total: number): (number | "...")[] => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 4) {
            return [1, 2, 3, 4, 5, "...", total];
        }

        if (current >= total - 3) {
            return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
        }

        return [1, "...", current - 1, current, current + 1, "...", total];
    };

    const visiblePages = getVisiblePages(currentPage, lastPage);

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => navigateToPage(currentPage - 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition
                        ${currentPage > 1
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700 cursor-pointer"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {visiblePages.map((page, i) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`dots-${i}`}
                                className="flex items-center justify-center w-10 h-10 text-netral-500 select-none"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            type="button"
                            key={page}
                            onClick={() => navigateToPage(page)}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium transition cursor-pointer
                                ${isActive
                                    ? "bg-primary border-primary text-white"
                                    : "bg-netral-100 border-netral-300 text-netral-700 hover:bg-netral-200"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => navigateToPage(currentPage + 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border transition
                        ${currentPage < lastPage
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700 cursor-pointer"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
