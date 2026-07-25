import React from "react";
import ActionDropdown from "@/shared/components/ui/dropdown/ActionDropdown";

type SubjectCardProps = {
    class_name: string;
    total: number;
    onDelete: () => void;
    onEdit: () => void;
};

const ClassCard: React.FC<SubjectCardProps> = ({
    class_name,
    total,
    onDelete,
    onEdit
}) => {
    return (
        <div className="w-full max-w-xl rounded-2xl border border-netral-300 bg-netral-100 p-4 hover:shadow">

            {/* Header */}
            <div className="flex items-start justify-between">
                <h3 className="font-semibold text-netral-900">
                    {class_name}
                </h3>

                <ActionDropdown
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            </div>

            {/* Info Section */}
            <div className="mt-4 grid grid-cols-3 justify-between gap-6">
                <div className="flex flex-col">
                    <span className="text-sm text-netral-600">Jumlah Siswa</span>
                    <span className="text-sm font-medium text-netral-900">
                        {total} Siswa
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
