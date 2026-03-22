import { MENU } from "./MenuRegistry";
import { ROLE_MENU } from "./role.map";

type Role = keyof typeof ROLE_MENU;

export const getSidebarConfig = (role: string) => {
    if (!(role in ROLE_MENU)) {
        return [];
    }

    const roleConfig = ROLE_MENU[role as Role];

    return Object.entries(roleConfig).map(([section, keys]) => ({
        title:
            section === "main" ? "Menu" : "Lainnya",
        items: keys.map((key) => MENU[key]),
    }));
};
