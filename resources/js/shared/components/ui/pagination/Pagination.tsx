import { router } from "@inertiajs/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
    filters?: Record<string, any>;
    routeName?: string;
    routeParams?: Record<string, any>;
    className?: string;

    currentPage?: number;
    lastPage?: number;
    onPageChange?: (page: number) => void;
}

export default function Pagination({
    links,
    filters = {},
    routeName,
    routeParams,
    className = "",
    currentPage: propCurrentPage,
    lastPage: propLastPage,
    onPageChange,
}: PaginationProps) {
    let currentPage = 1;
    let lastPage = 1;

    if (onPageChange) {
        currentPage = propCurrentPage ?? 1;
        lastPage = propLastPage ?? 1;
        if (lastPage <= 1) return null;
    } else {
        if (!links || links.length <= 3) return null;

        const rawPages = links.slice(1, -1);
        const activeItem = rawPages.find((p) => p.active);
        currentPage = activeItem ? parseInt(activeItem.label, 10) : 1;

        const numericPages = rawPages
            .map((p) => parseInt(p.label, 10))
            .filter((n) => !isNaN(n));
        lastPage = numericPages.length > 0 ? Math.max(...numericPages) : 1;

        if (lastPage <= 1) return null;
    }

    const navigateToPage = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) return;

        if (onPageChange) {
            onPageChange(page);
            return;
        }

        if (routeName) {
            router.get(
                routeParams ? route(routeName, routeParams) : route(routeName),
                { ...filters, page },
                { preserveState: true }
            );
        }
    };

    // Desktop view: 1 - 5 lalu "..."
    const getDesktopPages = (current: number, total: number): (number | "...")[] => {
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

    // Mobile view: 1 - 3 lalu "..."
    const getMobilePages = (current: number, total: number): (number | "...")[] => {
        if (total <= 5) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 3) {
            return [1, 2, 3, "...", total];
        }

        if (current >= total - 2) {
            return [1, "...", total - 2, total - 1, total];
        }

        return [1, "...", current, "...", total];
    };

    const desktopPages = getDesktopPages(currentPage, lastPage);
    const mobilePages = getMobilePages(currentPage, lastPage);

    const renderPageItem = (page: number | "...", key: string) => {
        if (page === "...") {
            return (
                <span
                    key={key}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm text-netral-500 select-none"
                >
                    ...
                </span>
            );
        }

        const isActive = page === currentPage;

        return (
            <button
                type="button"
                key={key}
                onClick={() => navigateToPage(page)}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border text-xs sm:text-sm font-medium transition cursor-pointer
                    ${isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-netral-100 border-netral-300 text-netral-700 hover:bg-netral-200"
                    }`}
            >
                {page}
            </button>
        );
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Previous */}
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => navigateToPage(currentPage - 1)}
                    aria-label="Previous Page"
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition
                        ${currentPage > 1
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700 cursor-pointer"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Mobile Page Numbers (1 - 3 ... total) */}
                <div className="flex sm:hidden items-center gap-1">
                    {mobilePages.map((page, i) => renderPageItem(page, `m-${page}-${i}`))}
                </div>

                {/* Desktop Page Numbers (1 - 5 ... total) */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {desktopPages.map((page, i) => renderPageItem(page, `d-${page}-${i}`))}
                </div>

                {/* Next */}
                <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => navigateToPage(currentPage + 1)}
                    aria-label="Next Page"
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition
                        ${currentPage < lastPage
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700 cursor-pointer"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
