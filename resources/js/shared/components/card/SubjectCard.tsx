import React from "react";
import ActionDropdown from "@/shared/components/ui/dropdown/ActionDropdown";
import Badge from "@/shared/components/ui/badge/Badge";

type SubjectCardProps = {
    name: string;
    nis?: string;
    gender: string;
    age: string;
    tanggal_lahir?: string;
    classLevel?: string | number;
    lastResult: string;
    is_self?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onClick?: () => void;
};

const SubjectCard: React.FC<SubjectCardProps> = ({
    name,
    nis,
    gender,
    age,
    tanggal_lahir,
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

            {/* NIS + Gender Badge */}
            <div className="flex items-center gap-2 flex-wrap">
                <Badge
                    size="sm"
                    color={gender === "female" ? "pink" : "info"}
                >
                    {gender === "female" ? "Perempuan" : "Laki-laki"}
                </Badge>
                {nis && (
                    <span className="text-xs text-netral-500 bg-netral-200 rounded-full px-2 py-0.5">
                        NIS: {nis}
                    </span>
                )}
            </div>

            {/* Info Section */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                    <span className="text-xs text-netral-500">Tanggal Lahir</span>
                    <span className="text-sm font-medium text-netral-900">
                        {tanggal_lahir
                            ? new Date(tanggal_lahir).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })
                            : "-"}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs text-netral-500">Usia</span>
                    <span className="text-sm font-medium text-netral-900">
                        {age} Tahun
                    </span>
                </div>

                {classLevel && (
                    <div className="flex flex-col">
                        <span className="text-xs text-netral-500">Kelas</span>
                        <span className="text-sm font-medium text-netral-900">
                            {classLevel}
                        </span>
                    </div>
                )}

                <div className="flex flex-col">
                    <span className="text-xs text-netral-500">Hasil Terakhir</span>
                    <span className="text-sm font-medium text-netral-900">
                        {lastResult ?? "-"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;