import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { toast } from "sonner";

import Form from "@/Components/form/Form";
import Input from "@/Components/form/input/InputField";
import { Modal } from "@/Components/ui/modal";

export default function DeleteUserModal({ isOpen, onClose }: any) {
    const { data, setData, delete: post, processing, reset, errors, clearErrors } = useForm({
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("profile.destroy"), {
            onSuccess: () => {
                onClose();
                reset();
                toast.success("Akun berhasil dihapus.");
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Apakah Anda yakin ingin menghapus akun Anda?"
            subtitle="Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengkonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen."
            danger
            formId="delete-user-form"
            submitLabel="Hapus Akun"
            cancelLabel="Batal"
            loading={processing}
            position="center"
            className="max-w-150"
        >
            <Form
                id="delete-user-form"
                onSubmit={submit}
                className="p-4 space-y-5"
            >

                {/* Password */}
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                />
            </Form>
        </Modal>
    );
}
