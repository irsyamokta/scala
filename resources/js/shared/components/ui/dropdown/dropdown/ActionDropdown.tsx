import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";
import { LuPencil, LuTrash2, LuLogIn } from "react-icons/lu";

type ActionDropdownProps = {
    is_self?: boolean;
    onView?: () => void;
    onLoginAs?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewLabel?: string;
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({
    is_self,
    onView,
    onLoginAs,
    onEdit,
    onDelete,
    viewLabel = "Lihat",
}) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            if (
                menuRef.current?.contains(e.target as Node) ||
                btnRef.current?.contains(e.target as Node)
            ) {
                return;
            }
            setOpen(false);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Hitung perkiraan tinggi menu dinamis berdasarkan jumlah item
    const itemCount = [
        Boolean(onView),
        Boolean(onLoginAs && !is_self),
        Boolean(onEdit),
        Boolean(onDelete),
    ].filter(Boolean).length;

    const menuH = itemCount * 46;

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!btnRef.current) return;

        const rect = btnRef.current.getBoundingClientRect();
        const openUp = window.innerHeight - rect.bottom < menuH;

        setPos({
            top: openUp ? rect.top - menuH : rect.bottom + 4,
            left: rect.right - 180,
        });

        setOpen((v) => !v);
    };

    const hasLoginAs = Boolean(onLoginAs && !is_self);

    const menu = (
        <div
            ref={menuRef}
            style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: 180,
            }}
            onClick={(e) => e.stopPropagation()}
            className="z-50 bg-netral-100 border border-netral-200 rounded-xl shadow-lg overflow-hidden"
        >
            {onView && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            onView();
                            setOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-netral-700 cursor-pointer"
                    >
                        <IoEyeOutline size={15} /> {viewLabel}
                    </button>
                    {(hasLoginAs || onEdit || onDelete) && (
                        <div className="border-t border-netral-200" />
                    )}
                </>
            )}

            {hasLoginAs && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            onLoginAs?.();
                            setOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-primary font-medium cursor-pointer"
                    >
                        <LuLogIn size={15} /> Masuk
                    </button>
                    {(onEdit || onDelete) && (
                        <div className="border-t border-netral-200" />
                    )}
                </>
            )}

            {onEdit && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        disabled={is_self}
                        className={`flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-netral-700 ${
                            is_self ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        }`}
                    >
                        <LuPencil size={14} /> Ubah
                    </button>
                    {onDelete && <div className="border-t border-netral-200" />}
                </>
            )}

            {onDelete && (
                <button
                    type="button"
                    onClick={() => {
                        onDelete();
                        setOpen(false);
                    }}
                    disabled={is_self}
                    className={`flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-netral-200 transition text-red-500 ${
                        is_self ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    }`}
                >
                    <LuTrash2 size={14} /> Hapus
                </button>
            )}
        </div>
    );

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-netral-200 transition cursor-pointer"
            >
                <HiDotsHorizontal size={16} />
            </button>
            {open && createPortal(menu, document.body)}
        </>
    );
};

export default ActionDropdown;
