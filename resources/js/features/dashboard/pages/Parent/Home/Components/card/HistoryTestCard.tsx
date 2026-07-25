import Badge from "@/shared/components/ui/badge/Badge";
import { categoryColor } from "@/shared/constants/screening";

interface HistoryTestCardProps {
    name: string;
    date: string;
    category: string;
}

interface Props {
    data: HistoryTestCardProps[]
}

export default function HistoryTestCard({
    data
}: Props) {

    const isEmpty = data.length === 0;

    return (
        <div className="bg-netral-100 rounded-2xl border border-netral-300 p-6">
            <div className="flex flex-row items-center justify-between gap-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Riwayat Tes Terbaru</h3>
            </div>

            <div className="w-full flex flex-col gap-3">
                {isEmpty ? (
                    <div className="h-88 flex items-center justify-center text-gray-400">
                        Tidak ada data
                    </div>
                ) : (
                    data.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-start border border-gray-300 rounded-xl p-4 hover:shadow"
                        >
                            {/* Left Content */}
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-900 font-medium">
                                    {item.name}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">
                                    {item.date}
                                </p>
                            </div>

                            {/* Right Content */}
                            <Badge color={categoryColor[item.category]}>
                                {item.category}
                            </Badge>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
