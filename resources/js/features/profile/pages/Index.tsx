import { Head, usePage } from '@inertiajs/react';

import usePermission from '@/shared/hooks/usePermission';

import { PageProps } from '@/types';
import { UserPageProps } from '@/types/user';

import DashboardLayout from '@/Layouts/DashboardLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateSchoolInformationForm from './Partials/UpdateSchoolInformationForm';

export default function Index({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth, subject } = usePage<UserPageProps>().props;

    const isSuperadmin = auth.user.role === "superadmin";

    const { can } = usePermission();

    return (
        <DashboardLayout title="Profil Saya">
            <Head title="Profil Saya" />

            <div className="bg-netral-100 p-4 md:p-6 rounded-xl border border-netral-300">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-netral-900">
                            Pengaturan Profil
                        </h2>

                        <p className="text-sm text-netral-600 mt-1">
                            Kelola pengaturan profil akun dan informasi pribadi Anda.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {/* Profile Information */}
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Basic Information */}
                        <UpdateProfileInformationForm
                            user={auth.user}
                            subject={subject}
                        />

                        {/* School Information */}
                        {
                            can("manage.profile.school") && !isSuperadmin &&
                            <UpdateSchoolInformationForm
                                user={auth.user}
                            />
                        }

                        {/* Account Information */}
                        {!isSuperadmin && (
                            <UpdatePasswordForm
                                user={auth.user}
                            />
                        )}

                    </div>

                    {/* Delete Account */}
                    {!isSuperadmin && (
                        <div className="col-span-12">
                            <DeleteUserForm />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
