import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";

import { SubjectSelectedModalProps } from "@/types/subject";

import Form from "@/Components/form/Form";
import Select from "@/Components/form/input/Select";
import { Modal } from "@/Components/ui/modal";

export default function SelectSubjectModal({
    isOpen,
    onClose,
    subjects,
    instrument
}: SubjectSelectedModalProps) {

    const [subjectId, setSubjectId] = useState("");

    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!subjectId) {
            toast.error("Silahkan pilih keluarga terlebih dahulu");
            return;
        }

        router.get(
            route("screening.form", {
                instrument,
                subject: subjectId
            })
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Tes Skrining ${instrument}`}
            subtitle="Silahkan pilih keluarga yang akan dilakukan tes"
            formId="select-subject-form"
            submitLabel="Mulai Tes"
            cancelLabel="Batal"
            position="center"
            className="max-w-110 h-80"
        >
            <Form
                id="select-subject-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >
                <Select
                    label="Pilih keluarga untuk tes"
                    placeholder="Pilih keluarga"
                    options={subjects.map((s) => ({
                        value: s.id,
                        label: `${s.name} (${s.age} tahun)`
                    }))}
                    value={subjectId}
                    onChange={(value) => setSubjectId(value as string)}
                />
            </Form>
        </Modal>
    );
}
