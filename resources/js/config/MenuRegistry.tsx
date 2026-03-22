import { ReactNode } from "react";

import { BiHomeAlt2 } from "react-icons/bi";
import { RiFileCopy2Line } from "react-icons/ri";
import { PiFolderOpen, PiUsers, PiChalkboardTeacher, PiBuildingApartment } from "react-icons/pi";
import { RiUserSettingsLine } from "react-icons/ri";
import { LiaFileAltSolid } from "react-icons/lia";
import { TbHistoryToggle } from "react-icons/tb";

type MenuContext = {
    subjectId?: string;
};

export interface MenuItem {
    name: string;
    icon: ReactNode;
    path?: string;
    buildPath?: (ctx: MenuContext) => string;
    children?: MenuItem[];
}

export const MENU = {
    dashboard: {
        name: "Beranda",
        icon: <BiHomeAlt2 size={22} />,
        path: "/dashboard",
    },

    test_screening: {
        name: "Tes Skrining",
        icon: <RiFileCopy2Line size={22} />,
        path: "/tes-skrining",
    },

    instrument: {
        name: "Instrumen Tes",
        icon: <PiFolderOpen size={22} />,
        children: [
            {
                name: "SDQ Test",
                icon: <LiaFileAltSolid size={20} />,
                path: "/instrumen/SDQ",
            },
            {
                name: "SRQ Test",
                icon: <LiaFileAltSolid size={20} />,
                path: "/instrumen/SRQ",
            },
        ],
    },

    user: {
        name: "Manajemen Pengguna",
        icon: <PiUsers size={22} />,
        path: "/pengguna",
    },

    family: {
        name: "Profil Keluarga",
        icon: <PiUsers size={22} />,
        path: "/profil-keluarga",
    },

    student: {
        name: "Profil Siswa",
        icon: <PiUsers size={22} />,
        path: "/profil-siswa",
    },

    class: {
        name: "Daftar Kelas",
        icon: <PiChalkboardTeacher size={22} />,
        path: "/daftar-kelas",
    },

    school: {
        name: "Profil Sekolah",
        icon: <PiBuildingApartment size={22} />,
        path: "/profil",
    },

    history: {
        name: "Riwayat Tes",
        icon: <TbHistoryToggle size={22} />,
        buildPath: ({ subjectId }) => {
            return `/riwayat-tes/${subjectId}`;
        },
    },

    profile: {
        name: "Profil Saya",
        icon: <RiUserSettingsLine size={22} />,
        path: "/profil",
    },
} as const satisfies Record<string, MenuItem>;

export type MenuKey = keyof typeof MENU;
