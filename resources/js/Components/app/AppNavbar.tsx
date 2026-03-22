import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import Button from "@/Components/ui/button/Button";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import Logo from "../../../assets/svg/logo-color.svg";

interface NavbarProps {
    hideOnScroll?: boolean;
}

interface NavItem {
    name: string;
    href: string;
    section?: string;
}

const NAV_ITEMS: NavItem[] = [
    { name: "Tentang", href: "/", section: "tentang" },
    { name: "SDQ & SRQ", href: "/#sdq-srq", section: "sdq-srq" },
    { name: "Psikolog", href: "/#psikolog", section: "psikolog" },
    { name: "Uji Coba", href: "/uji-coba" },
];

const Navbar = ({ hideOnScroll = true }: NavbarProps) => {
    const { url } = usePage();

    const [openMenu, setOpenMenu] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        if (!hideOnScroll) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [hideOnScroll]);

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-40% 0px -50% 0px",
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const isActive = (item: NavItem) => {
        if (item.section) {
            return activeSection === item.section;
        }

        return url.startsWith(item.href);
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-netral-100 border-b border-netral-300 z-50 transition-transform duration-300 ${
                hideOnScroll
                    ? showNavbar
                        ? "translate-y-0"
                        : "-translate-y-full"
                    : "translate-y-0"
            }`}
        >
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/">
                    <img src={Logo} alt="Scala logo" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-10 text-netral-600">

                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative transition-colors ${
                                    active
                                        ? "text-primary font-semibold"
                                        : "hover:text-netral-900"
                                }`}
                            >
                                {item.name}

                                {active && (
                                    <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-primary"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Button */}
                <div className="hidden lg:flex">
                    <Link href="/login">
                        <Button size="lg">
                            Masuk
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-2xl text-netral-700"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Menu */}
            {openMenu && (
                <div className="lg:hidden bg-white border-t border-netral-200">
                    <div className="flex flex-col px-6 py-4 space-y-3 text-sm">

                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`py-2 ${
                                        active
                                            ? "text-primary font-medium"
                                            : "hover:text-netral-900"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}

                        <Link href="/login">
                            <Button className="w-full py-2 rounded-xl">
                                Masuk
                            </Button>
                        </Link>

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
