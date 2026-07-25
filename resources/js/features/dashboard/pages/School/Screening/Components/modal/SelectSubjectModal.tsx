import { useState, useEffect, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";

import { SubjectSelectedModalProps } from "@/types/subject";

import Form from "@/shared/components/forms/Form";
import Select from "@/shared/components/forms/Select";
import { Modal } from "@/shared/components/ui/modal";

export default function SelectSubjectModal({
    isOpen,
    onClose,
    subjects,
    instrument
}: SubjectSelectedModalProps) {

    const { flash } = usePage().props as any;

    const [classId, setClassId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setClassId("");
            setSubjectId("");
        }
    }, [isOpen]);

    const classOptions = useMemo(() => {

        const map = new Map();

        subjects.forEach((s) => {
            if (s.class) {
                map.set(s.class_id, {
                    value: s.class_id,
                    label: s.class.class_name
                });
            }
        });

        return Array.from(map.values());

    }, [subjects]);


    const filteredSubjects = useMemo(() => {
        if (!classId) return [];

        return subjects.filter((s) => s.class_id === classId);

    }, [classId, subjects]);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!subjectId) {
            toast.error("Silahkan pilih siswa terlebih dahulu");
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
            subtitle="Silahkan pilih siswa yang akan dilakukan tes"
            formId="select-subject-form"
            submitLabel="Mulai Tes"
            cancelLabel="Batal"
            position="center"
            className="max-w-110 h-96"
        >
            <Form
                id="select-subject-form"
                onSubmit={handleSubmit}
                className="p-4 space-y-5"
            >

                {/* Select Class */}
                <Select
                    label="Pilih kelas"
                    placeholder="Pilih kelas"
                    options={classOptions}
                    value={classId}
                    onChange={(value) => {
                        setClassId(value as string);
                        setSubjectId("");
                    }}
                />

                {/* Select Subject */}
                <Select
                    label="Pilih siswa untuk tes"
                    placeholder="Pilih siswa"
                    disabled={!classId}
                    options={filteredSubjects.map((s) => ({
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