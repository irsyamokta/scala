import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Badge from "@/shared/components/ui/badge/Badge";
import Button from "@/shared/components/ui/button/Button";
import { EmptyTable } from "@/shared/components/empty/EmptyTable";
import { StudentPin } from "@/types/pin-batch";
import { ScreeningResult } from "@/types/screening";
import { IoEyeOutline } from "react-icons/io5";

interface PinRecapTableProps {
    pins: StudentPin[];
    onView: (screening: ScreeningResult) => void;
}

const categoryColor: Record<string, "success" | "warning" | "error"> = {
    Normal:     "success",
    Borderline: "warning",
    Abnormal:   "error",
};

export default function PinRecapTable({ pins, onView }: PinRecapTableProps) {
    return (
        <div className="border border-netral-300 rounded-xl overflow-hidden">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-netral-300">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">No</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Nama Siswa</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Tanggal Tes</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Kategori</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Status Analisis</TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">Aksi</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pins.length === 0 ? (
                            <EmptyTable colspan={6} description="Belum ada data." />
                        ) : pins.map((pin, i) => {
                            const screening = pin.screening as any;
                            const sdq       = screening?.sdq_result;
                            const isDone    = screening?.status === "Selesai Dievaluasi";
                            const cat       = sdq?.overall_category;
                            const subject   = (pin as any).subject;

                            return (
                                <TableRow key={pin.id} className="border-b border-netral-300">
                                    <TableCell className="px-6 py-4 text-sm text-netral-600">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                        {subject?.name ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                        {screening?.date_taken
                                            ? new Date(screening.date_taken).toLocaleDateString("id-ID", {
                                                  day: "numeric", month: "short", year: "numeric",
                                              })
                                            : <span className="italic text-netral-500">Belum tes</span>}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        {cat
                                            ? <Badge color={categoryColor[cat] ?? "dark"} size="sm">{cat}</Badge>
                                            : <span className="text-netral-400">-</span>}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        {!pin.used_at
                                            ? <span className="text-sm italic text-netral-500">Belum tes</span>
                                            : <Badge color={isDone ? "success" : "warning"} size="sm">
                                                {isDone ? "Selesai" : "Menunggu"}
                                              </Badge>}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        {screening ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={<IoEyeOutline size={14} />}
                                                onClick={() => onView(screening as ScreeningResult)}
                                            >
                                                Lihat Detail
                                            </Button>
                                        ) : (
                                            <span className="text-sm italic text-netral-400">Belum tes</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
