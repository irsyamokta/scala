import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type ActionDropdownProps = {
    is_self?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({
    is_self,
    onEdit,
    onDelete,
}) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const toggleDropdown = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        const dropdownHeight = 96;
        const spaceBelow = window.innerHeight - rect.bottom;

        const openUp = spaceBelow < dropdownHeight;

        setPosition({
            top: openUp ? rect.top - dropdownHeight : rect.bottom + 4,
            left: rect.right - 176,
        });

        setOpen(!open);
    };

    const dropdown = (
        <div
            ref={dropdownRef}
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: 176,
            }}
            className=" z-99 bg-netral-100 border rounded-xl shadow-lg overflow-hidden"
        >
            <button
                onClick={() => {
                    onEdit?.();
                    setOpen(false);
                }}
                disabled={is_self}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-netral-200 ${is_self ? "cursor-not-allowed opacity-50" : ""}`}
            >
                Ubah
                <FiEdit2 />
            </button>

            <div className="border-t"></div>

            <button
                onClick={() => {
                    onDelete?.();
                    setOpen(false);
                }}
                disabled={is_self}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm text-red-600 hover:bg-netral-200 ${is_self ? "cursor-not-allowed opacity-50" : ""}`}
            >
                Hapus
                <FiTrash2 />
            </button>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-netral-200"
            >
                <HiDotsHorizontal size={16} />
            </button>

            {open && createPortal(dropdown, document.body)}
        </>
    );
};

export default ActionDropdown;
