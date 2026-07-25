import { useRef, useEffect, useState } from "react";
import Button from "@/shared/components/ui/button/Button";
import { AiOutlineLoading3Quarters, AiOutlineClose } from "react-icons/ai";

type ModalPosition = "left" | "center" | "right";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;

    position?: ModalPosition;

    showCloseButton?: boolean;
    isFullscreen?: boolean;

    title?: string;
    subtitle?: string;

    danger?: boolean;

    formId?: string;
    submitLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    hideCancel?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
    position = "center",
    showCloseButton = true,
    isFullscreen = false,
    title,
    subtitle,
    danger,
    formId,
    submitLabel,
    cancelLabel,
    loading,
    hideCancel,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setShow(true);
                });
            });
        } else {
            setShow(false);

            const timer = setTimeout(() => {
                setMounted(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        if (isOpen) document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    const radiusClasses = {
        center: "rounded-xl",
        right: "rounded-3xl",
        left: "rounded-3xl",
    };

    const positionClasses = {
        left: "items-stretch justify-start",
        center: "items-center justify-center",
        right: "items-stretch justify-end",
    };

    const transformClasses = {
        center: show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2",

        right: show
            ? "translate-x-0"
            : "translate-x-full",

        left: show
            ? "translate-x-0"
            : "-translate-x-full",
    };

    const contentClasses = isFullscreen
        ? "w-full h-full"
        : "relative w-full bg-netral-100 dark:bg-netral-900 shadow-2xl";

    return (
        <div
            className={`fixed inset-0 flex ${positionClasses[position]} overflow-y-auto z-50 p-4`}
        >
            {/* Backdrop */}
            {!isFullscreen && (
                <div
                    className={`
                        fixed inset-0
                        bg-netral-900/50
                        backdrop-blur-sm
                        transition-opacity
                        duration-300
                        ease-[cubic-bezier(.16,1,.3,1)]
                        ${show ? "opacity-100" : "opacity-0"}
                    `}
                    onClick={onClose}
                />
            )}

            {/* Modal */}
            <div
                ref={modalRef}
                className={`
                    ${contentClasses}
                    ${className}
                    flex flex-col
                    ${position === "center" ? "max-h-[90vh]" : "h-full"}
                    ${radiusClasses[position]}

                    transform-gpu
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(.16,1,.3,1)]
                    will-change-transform

                    ${transformClasses[position]}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || subtitle) && (
                    <div className="sticky top-0 z-10 bg-netral-100 dark:bg-netral-900 px-4 md:px-6 pt-6 py-4 border-b rounded-t-xl">
                        <h4 className="text-xl font-semibold text-netral-800 dark:text-white mr-4">
                            {title}
                        </h4>

                        {subtitle && (
                            <p className="mt-1 text-sm text-netral-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Close Button */}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-6 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-netral-600 hover:bg-netral-200/30"
                    >
                        <AiOutlineClose className="h-4 w-4" />
                    </button>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {(formId || submitLabel) && (
                    <div className="sticky bottom-0 bg-netral-100 dark:bg-netral-900 px-4 md:px-6 py-4 border-t rounded-b-xl">
                        <div className="flex justify-end gap-3">
                            {!hideCancel && (
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    {cancelLabel ?? "Batal"}
                                </Button>
                            )}

                            {formId && (
                                <Button
                                    type="submit"
                                    form={formId}
                                    disabled={loading}
                                    className={`flex-1 ${danger ? "bg-red-600 hover:bg-red-600/80" : ""}`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <AiOutlineLoading3Quarters className="animate-spin" />
                                            Loading...
                                        </div>
                                    ) : (
                                        submitLabel ?? "Simpan"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
