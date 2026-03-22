import React from "react";
import ActionDropdown from "@/Components/ui/dropdown/ActionDropdown";
import Badge from "@/Components/ui/badge/Badge";

type SubjectCardProps = {
    name: string;
    gender: string;
    age: string;
    classLevel?: string | number;
    lastResult: string;
    is_self?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onClick?: () => void;
};

const SubjectCard: React.FC<SubjectCardProps> = ({
    name,
    gender,
    age,
    classLevel,
    lastResult,
    is_self,
    onDelete,
    onEdit,
    onClick,
}) => {
    return (
        <div onClick={onClick} className="w-full max-w-xl rounded-2xl border border-netral-300 bg-netral-100 p-4 hover:shadow-sm cursor-pointer">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-netral-900">
                    {name}
                </h3>

                <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ActionDropdown
                        is_self={is_self}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                </div>
            </div>

            {/* Gender Badge */}
            <div>
                <Badge
                    size="sm"
                    color={gender === "female" ? "pink" : "info"}
                >
                    {gender === "female" ? "Perempuan" : "Laki-laki"}
                </Badge>
            </div>

            {/* Info Section */}
            <div className="mt-4 grid grid-cols-3 justify-between gap-6">
                <div className="flex flex-col">
                    <span className="text-sm text-netral-600">Usia</span>
                    <span className="text-sm font-medium text-netral-900">
                        {age} Tahun
                    </span>
                </div>

                {classLevel && (
                    <div className="flex flex-col">
                        <span className="text-sm text-netral-600">Kelas</span>
                        <span className="text-sm font-medium text-netral-900">
                            {classLevel}
                        </span>
                    </div>
                )}

                <div className={`${classLevel ? "col-span-1" : "col-span-2"} flex flex-col`}>
                    <span className="text-sm text-netral-600">
                        Hasil Terakhir
                    </span>
                    <span className="text-sm font-medium text-netral-900">
                        {lastResult ?? "-"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;