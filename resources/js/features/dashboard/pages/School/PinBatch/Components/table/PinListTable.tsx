import { LuRefreshCw } from "react-icons/lu";

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

interface PinListTableProps {
    pins: StudentPin[];
    batchClosed: boolean;
    onRegenerate: (pinId: string) => void;
}

export default function PinListTable({ pins, batchClosed, onRegenerate }: PinListTableProps) {
    const colSpan = batchClosed ? 3 : 4;

    return (
        <div className="border border-netral-300 rounded-xl overflow-hidden">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-netral-300">
                        <TableRow>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                Siswa
                            </TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                PIN
                            </TableCell>
                            <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                Status
                            </TableCell>
                            {!batchClosed && (
                                <TableCell isHeader className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap">
                                    Aksi
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pins.length === 0 ? (
                            <EmptyTable colspan={colSpan} description="Belum ada PIN." />
                        ) : pins.map((pin) => {
                            const isUsed  = !!pin.used_at;
                            const subject = (pin as any).subject;

                            return (
                                <TableRow key={pin.id} className="border-b border-netral-300">
                                    <TableCell className="px-6 py-4">
                                        <p className="text-sm font-medium text-netral-900">
                                            {subject?.name ?? "-"}
                                        </p>
                                        {subject?.nis && (
                                            <p className="text-xs text-netral-600">NIS: {subject.nis}</p>
                                        )}
                                    </TableCell>

                                    <TableCell className="px-6 py-4 font-mono font-bold tracking-widest text-sm text-netral-900 whitespace-nowrap">
                                        {pin.pin_code}
                                    </TableCell>

                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <Badge color={isUsed ? "success" : "warning"} size="sm">
                                            {isUsed ? "Terpakai" : "Belum Dipakai"}
                                        </Badge>
                                    </TableCell>

                                    {!batchClosed && (
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            {!isUsed && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<LuRefreshCw size={12} />}
                                                    onClick={() => onRegenerate(pin.id)}
                                                >
                                                    Regenerate
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
