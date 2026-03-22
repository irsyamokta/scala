import { useDelete } from "@/hooks/useDelete";

import { UsersTableProps } from "@/types/user";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import FilterBar from "@/Components/filter/FilterBar";
import ActionDropdown from "@/Components/ui/dropdown/ActionDropdown";
import Button from "@/Components/ui/button/Button";
import { EmptyTable } from "@/Components/empty/EmptyTable";
import Pagination from "@/Components/ui/pagination/Pagination";
import Select from "@/Components/form/input/Select";

import { PER_PAGE_OPTIONS } from "@/constants/filterOptions";

import { formatDateTime } from "@/utils/formatDate";

import { RiUserAddLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";

const labels: Record<string, string> = {
    parent: "Orang Tua",
    school: "Sekolah",
    general: "Umum",
    psychologist: "Psikolog",
    superadmin: "Superadmin"
};

export default function UserTable({
    users,
    filters,
    setFilter,
    onView,
    onCreate,
    onEdit,
}: UsersTableProps) {
    const { handleDelete } = useDelete({
        routeName: "user.destroy",
        confirmTitle: "Hapus Pengguna?",
        confirmText: "Pengguna tidak akan bisa lagi menggunakan fitur-fitur dashboard untuk melakukan tes skrining.",
        successMessage: "Pengguna berhasil dihapus",
        errorMessage: "Gagal menghapus pengguna",
    });

    return (
        <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
            {/* Header */}
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4 mb-6">

                <div>
                    <h2 className="text-lg font-semibold text-netral-900">
                        Daftar Pengguna
                    </h2>

                    <p className="text-sm text-netral-600 mt-1">
                        Berikut adalah daftar pengguna yang sudah terdaftar.
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center gap-2">
                    {/* Filter User */}
                    <FilterBar
                        className="flex-1"
                        search={{
                            value: filters?.search ?? "",
                            placeholder: "Cari pengguna",
                            onChange: (value) => setFilter?.("search", value),
                        }}
                        filter={{
                            label: "Peran",
                            value: filters?.roles ?? [],
                            options: [
                                { value: "parent", label: "Orang Tua" },
                                { value: "school", label: "Sekolah" },
                                { value: "general", label: "Umum" },
                                { value: "psychologist", label: "Psikolog" },
                            ],
                            onChange: (value) =>
                                setFilter?.("roles", Array.isArray(value) ? value : [value]),
                        }}
                    />

                    {/* Add User */}
                    <Button
                        size="icon"
                        variant="icon"
                        onClick={onCreate}
                    >
                        <RiUserAddLine size={20} />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-netral-300 rounded-xl">
                <div className="w-full overflow-x-auto overflow-y-visible">

                    <Table>
                        {/* Header */}
                        <TableHeader className="border-netral-300 border-b">
                            <TableRow>

                                {/* Name */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Nama Pengguna
                                </TableCell>

                                {/* Email */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Email
                                </TableCell>

                                {/* Contact */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Kontak
                                </TableCell>

                                {/* Role */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Peran
                                </TableCell>

                                {/* Created */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Tanggal Daftar
                                </TableCell>

                                {/* View Detail */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Detail
                                </TableCell>

                                {/* Action */}
                                <TableCell
                                    isHeader
                                    className="px-6 py-3 text-sm font-semibold text-netral-900 text-start whitespace-nowrap"
                                >
                                    Aksi
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* Body */}
                        <TableBody>

                            {users?.data?.length === 0 ? (
                                <EmptyTable colspan={6} description="Tidak ada data pengguna" />
                            ) : (

                                users?.data?.map((user) => (
                                    <TableRow key={user.id} className="border-netral-300 border-b">

                                        {/* Name */}
                                        <TableCell className="px-6 py-4 text-sm font-medium text-netral-900 whitespace-nowrap">
                                            {user.name}
                                        </TableCell>

                                        {/* Email */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {user.email}
                                        </TableCell>

                                        {/* Contact */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {user.contact ? user.contact : '-'}
                                        </TableCell>

                                        {/* Role */}
                                        <TableCell className="px-6 py-4 text-sm whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-md bg-netral-200 text-netral-700 text-xs font-medium">
                                                {labels[user.role]}
                                            </span>
                                        </TableCell>

                                        {/* Created */}
                                        <TableCell className="px-6 py-4 text-sm text-netral-600 whitespace-nowrap">
                                            {user.created_at ? formatDateTime(user.created_at) : '-'}
                                        </TableCell>

                                        {/* View Detail */}
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                startIcon={<IoEyeOutline />}
                                                onClick={() => onView(user)}
                                                className="cursor-pointer"
                                            >
                                                Lihat Detail
                                            </Button>
                                        </TableCell>

                                        {/* Action */}
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <ActionDropdown
                                                onEdit={() =>
                                                    onEdit(user)
                                                }
                                                onDelete={() =>
                                                    handleDelete(user.id)
                                                }
                                            />
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center gap-2">
                <Select
                    value={filters?.per_page ?? 10}
                    placeholder="10"
                    onChange={(value) => setFilter?.("per_page", value)}
                    className="max-w-18 mt-6"
                    options={PER_PAGE_OPTIONS}
                />

                <Pagination
                    links={users.links}
                    filters={filters ?? {}}
                    routeName="user.index"
                />
            </div>
        </div>
    );
}
