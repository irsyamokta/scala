import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import PinBatchModal from "./Components/modal/PinBatchModal";
import PinBatchCard from "./Components/card/PinBatchCard";
import { PinBatchIndexPageProps } from "@/types/pin-batch";

interface PinBatchPageProps extends PinBatchIndexPageProps {
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
}

export default function PinBatchIndex() {
    const { batches, classes, instruments } =
        usePage<PinBatchPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout title="PIN Batch">
            <Head title="PIN Batch" />

            <PinBatchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classes={classes}
                instruments={instruments}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <PinBatchCard
                        batches={batches}
                        onCreate={() => setIsModalOpen(true)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
