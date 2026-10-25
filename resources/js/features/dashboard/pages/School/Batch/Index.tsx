import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import BatchModal from "./Components/modal/BatchModal";
import BatchCard from "./Components/card/BatchCard";
import { BatchIndexPageProps } from "@/types/batch";

interface BatchPageProps extends BatchIndexPageProps {
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
}

export default function BatchIndex() {
    const { batches, classes, instruments } =
        usePage<BatchPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout title="Batch Skrining">
            <Head title="Batch Skrining" />

            <BatchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classes={classes}
                instruments={instruments}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <BatchCard
                        batches={batches}
                        onCreate={() => setIsModalOpen(true)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
