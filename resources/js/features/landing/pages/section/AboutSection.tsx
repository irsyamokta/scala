import Badge from "@/shared/components/ui/badge/Badge";

import { TbFileDescriptionFilled } from "react-icons/tb";
import { PiFoldersFill } from "react-icons/pi";
import { RiFileSearchFill } from "react-icons/ri";

interface AboutItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const DATA: AboutItem[] = [
    {
        icon: <TbFileDescriptionFilled className="text-primary" size={40} />,
        title: "Dokumentasi Terstruktur",
        description: "Menggunakan instrumen SDQ dan SRQ-29, sesuai dengan protokol evaluasi psikologis yang diakui secara internasional."
    },
    {
        icon: <RiFileSearchFill className="text-primary" size={40} />,
        title: "Klasifikasi Risiko Otomatis",
        description: "Sistem menghitung skor secara otomatis dan mengelompokkan hasil ke dalam kategori risiko untuk membantu interpretasi awal."
    },
    {
        icon: <PiFoldersFill className="text-primary" size={40} />,
        title: "Monitoring Terstruktur",
        description: "Mendukung perbandingan baseline dan follow-up untuk melihat perkembangan kondisi secara longitudinal."
    }
];

export default function AboutSection() {
    return (
        <section className="relative overflow-hidden px-6 lg:px-20 py-12 pt-24 mb-10">
            <div className="flex flex-col gap-4 md:gap-12 items-center">
                {/* Title */}
                <div
                    data-aos="fade-up"
                    className="flex flex-col justify-center items-center">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div
                            className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Tentang Scala
                        </div>
                    </Badge>

                    <h1 className="header-2 mb-6 text-center">
                        Pendekatan Sistematis <br />
                        untuk Deteksi Dini
                    </h1>
                </div>

                {/* Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {DATA.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            className="bg-netral-100 rounded-2xl p-5 flex flex-col gap-4 border border-netral-300 hover:shadow-lg"
                        >
                            {/* Icon */}
                            <div className="w-18 h-18 flex justify-center items-center p-4 bg-secondary rounded-xl mb-4">
                                {item.icon}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3">
                                <h5 className="header-5">
                                    {item.title}
                                </h5>
                                <p className="subheader-2">
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
