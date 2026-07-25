import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";

import { useSearch } from "@/shared/hooks/useSearch";

import { User, UserPageProps } from "@/types/user";

import DashboardLayout from "@/Layouts/DashboardLayout";
import UserTable from "./Components/table/UserTable";
import UserModal from "./Components/modal/UserModal";
import UserDetailModal from "./Components/modal/UserDetailModal";

type ModalType = "create" | "edit" | "detail" | null;

export default function Index() {
    const { users, filters: search } = usePage<UserPageProps>().props;

    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { filters, setFilter } = useSearch<{
        search: string;
        roles: string[];
    }>({
        routeName: "user.index",
        initialFilters: {
            search: search?.search ?? "",
            roles: search?.roles ?? [],
        },
    });

    const handleView = (user: User) => {
        setSelectedUser(user);
        setModalType("detail");
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setModalType("create");
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setModalType("edit");
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    return (
        <DashboardLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            {/* Form Modal */}
            <UserModal
                isOpen={modalType === "create" || modalType === "edit"}
                onClose={handleCloseModal}
                user={modalType === "edit" ? selectedUser : null}
            />

            {/* Detail Modal */}
            <UserDetailModal
                isOpen={modalType === "detail"}
                onClose={handleCloseModal}
                user={selectedUser}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <UserTable
                        users={users}
                        filters={filters}
                        setFilter={setFilter as any}
                        onView={handleView}
                        onCreate={handleCreate}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
