import { Link } from "@inertiajs/react";

import { Subject } from "@/types/subject";
import { ScreeningResult, PaginatedResponse } from "@/types/screening";

import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import TestHistoryTable from "../table/TestHistoryTable";

import { categoryColor } from "@/constants/screening";

import { IoIosArrowRoundBack } from "react-icons/io";

import Decorative from "../../../../../../../assets/svg/bg-decoration-2.svg";

type TestHistoryCardProps = {
    subject: Subject;
    screenings: PaginatedResponse<ScreeningResult>;
    onView: (screening: ScreeningResult) => void;
};

export default function TestHistoryCard({
    subject,
    screenings,
    onView,
}: TestHistoryCardProps) {

    const lastCategory =
        screenings.data.length > 0
            ? screenings.data[0]?.sdq_result?.overall_category ??
            (() => {
                const srq = screenings.data[0]?.srq_result;

                if (!srq) return null;

                const isIndicated =
                    srq.gme_indication ||
                    srq.substance_use_indication ||
                    srq.psychotic_symptom_indication ||
                    srq.ptsd_symptom_indication;

                return isIndicated
                    ? "Terindikasi"
                    : "Tidak Terindikasi";
            })()
            : subject.last_result;

    return (
        <div className="relative bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300 overflow-hidden">
            {/* Decoration */}
            <img src={Decorative} alt="" className="absolute -top-12 -right-26 rotate-1 hidden sm:block" />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={route("subject.parent.index")}>
                    <Button size="icon" variant="outline">
                        <IoIosArrowRoundBack size={24} />
                    </Button>
                </Link>

                <h2 className="text-lg font-semibold text-netral-900">
                    Riwayat Tes
                </h2>
            </div>

            {/* Subject Info */}
            <div className="grid grid-cols-[140px_1fr] gap-y-3 mt-6 max-w-md">

                <p className="text-sm text-netral-600">Nama</p>
                <p className="text-sm font-semibold text-netral-900">
                    {subject.name}
                </p>

                <p className="text-sm text-netral-600">Jenis Kelamin</p>
                <p className="text-sm font-semibold text-netral-900">
                    {subject.gender == "male" ? "Laki-laki" : "Perempuan"}
                </p>

                <p className="text-sm text-netral-600">Usia</p>
                <p className="text-sm font-semibold text-netral-900">
                    {subject.age} Tahun
                </p>

                <p className="text-sm text-netral-600">Riwayat Terakhir</p>
                <div>
                    {lastCategory ? (
                        <Badge color={categoryColor[lastCategory]}>
                            {lastCategory}
                        </Badge>
                    ) : (
                        <p className="text-sm font-semibold text-netral-900">-</p>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="mt-6">
                <TestHistoryTable
                    screenings={screenings}
                    onView={onView}
                />
            </div>

        </div>
    );
}
