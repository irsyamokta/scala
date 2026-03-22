import Badge from "@/Components/ui/badge/Badge";

import ImageRole1 from "../../../../assets/img/img-role-1.webp";
import ImageRole2 from "../../../../assets/img/img-role-2.webp";
import ImageRole3 from "../../../../assets/img/img-role-3.webp";

interface UserItem {
    image: string;
    role: string;
    description: string;
}

const DATA: UserItem[] = [
    {
        image: ImageRole1,
        role: "Orang Tua",
        description: "Lakukan skrining awal dan pantau perkembangan emosional anak secara berkala."
    },
    {
        image: ImageRole2,
        role: "Guru Sekolah",
        description: "Amati dan dokumentasikan perkembangan siswa dalam lingkungan sekolah."
    },
    {
        image: ImageRole3,
        role: "Masyarakat Umum",
        description: "Lakukan skrining untuk diri sendiri sebagai langkah awal memahami kondisi emosional pribadi."
    }
];

export default function UserSection() {
    return (
        <section className="relative overflow-hidden px-6 lg:px-20 py-12 pt-24 mb-10">
            <div className="flex flex-col gap-4 md:gap-12 items-center">
                {/* Title */}
                <div
                    data-aos="fade-up"
                    className="flex flex-col justify-center items-center">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Kami Ada untuk Anda
                        </div>
                    </Badge>

                    <h1 className="header-2 mb-3 text-center">
                        Untuk Siapa Scala Dirancang
                    </h1>
                    <p className="max-w-2xl text-center subheader-2 mb-6">
                        Dirancang untuk membantu berbagai individu dalam memahami dan memantau kondisi emosional dan perilaku secara lebih terstruktur dan mendalam.
                    </p>
                </div>

                {/* Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-4">
                    {DATA.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            className="flex flex-col gap-4"
                        >
                            {/* Image */}
                            <div className="w-full h-100 md:h-60 lg:h-100 overflow-hidden rounded-3xl">
                                <img
                                    src={item.image}
                                    alt={item.role}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1">
                                <h5 className="header-6">
                                    {item.role}
                                </h5>
                                <p className="paragraph-1 pr-4">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
