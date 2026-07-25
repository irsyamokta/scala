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
}

export default function Pagination({ links, filters, routeName }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    const handleClick = (url?: string | null) => {
        if (!url) return;

        const parsed = new URL(url, window.location.origin);
        const page = parsed.searchParams.get("page") || "1";

        router.get(route(routeName), { ...filters, page }, { preserveState: true });
    };

    const prev = links[0];
    const next = links[links.length - 1];
    const pages = links.slice(1, -1);

    return (
        <div className="flex justify-center mt-6">
            <div className="flex items-center gap-1.5">

                {/* Previous */}
                <button
                    disabled={!prev.url}
                    onClick={() => handleClick(prev.url)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border
                        ${prev.url
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {pages.map((link, i) => {
                    if (link.label.includes("...")) {
                        return (
                            <span
                                key={i}
                                className="flex items-center justify-center w-10 h-10 text-netral-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(link.url)}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium
                                ${link.active
                                    ? "bg-primary border-primary text-white"
                                    : "bg-netral-100 border-netral-300 text-netral-700 hover:bg-netral-200"
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}

                {/* Next */}
                <button
                    disabled={!next.url}
                    onClick={() => handleClick(next.url)}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg border
                        ${next.url
                            ? "bg-netral-100 border-netral-300 hover:bg-netral-200 text-netral-700"
                            : "bg-netral-200 border-netral-200 text-netral-400 cursor-not-allowed"
                        }`}
                >
                    <LuChevronRight size={18} />
                </button>

            </div>
        </div>
    );
}
