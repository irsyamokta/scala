import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";

import DashboardLayout from "@/Layouts/DashboardLayout";
import BatchModal from "./Components/modal/BatchModal";
import BatchCard from "./Components/card/BatchCard";
import { Batch, BatchIndexPageProps } from "@/types/batch";

interface BatchPageProps extends BatchIndexPageProps {
    classes: { id: string; class_name: string }[];
    instruments: { id: string; name: string }[];
}

export default function BatchIndex() {
    const { batches, classes, instruments, auth } =
        usePage<BatchPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

    const canDelete = auth.user.role === "superadmin";

    function handleCreate() {
        setEditingBatch(null);
        setIsModalOpen(true);
    }

    function handleEdit(batch: Batch) {
        setEditingBatch(batch);
        setIsModalOpen(true);
    }

    function handleClose() {
        setIsModalOpen(false);
        setEditingBatch(null);
    }

    return (
        <DashboardLayout title="Batch Skrining">
            <Head title="Batch Skrining" />

            <BatchModal
                isOpen={isModalOpen}
                onClose={handleClose}
                classes={classes}
                instruments={instruments}
                batch={editingBatch}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <BatchCard
                        batches={batches}
                        onCreate={handleCreate}
                        onEdit={handleEdit}
                        canDelete={canDelete}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
