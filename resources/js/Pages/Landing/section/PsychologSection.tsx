import Badge from "@/Components/ui/badge/Badge";

import ImagePsycholog1 from "../../../../assets/img/img-psycholog-1.webp";
import ImagePsycholog2 from "../../../../assets/img/img-psycholog-2.webp";
import ImagePsycholog3 from "../../../../assets/img/img-psycholog-3.webp";

interface PsychologItem {
    image: string;
    name: string;
    specialist: string;
}

const DATA: PsychologItem[] = [
    {
        image: ImagePsycholog1,
        name: "Dr. Angel, M.Psi., Psikolog",
        specialist: "Spesialis Psikologi Klinis"
    },
    {
        image: ImagePsycholog2,
        name: "Dr. Lenny, M.Psi., Psikolog",
        specialist: "Spesialis Psikologi Klinis"
    },
    {
        image: ImagePsycholog3,
        name: "Dr. Anna, M.Psi., Psikolog",
        specialist: "Spesialis Psikologi Klinis"
    }
];

export default function PsychologSection() {
    return (
        <section id="psikolog" className="relative overflow-hidden px-6 lg:px-20 py-12 pt-24 mb-10">
            <div className="flex flex-col gap-4 md:gap-12">
                {/* Title */}
                <div
                    data-aos="fade-up"
                    className="flex flex-col justify-center items-center">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Tim Profesional
                        </div>
                    </Badge>

                    <h1 className="header-2 mb-6 text-center">
                        Ditangani oleh Tim Psikolog Profesional
                    </h1>
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
                            <div className="w-full hh-100 md:h-60 lg:h-100 overflow-hidden rounded-3xl">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col items-center gap-1">
                                <h5 className="header-6">
                                    {item.name}
                                </h5>
                                <p className="paragraph-1 pr-4">
                                    {item.specialist}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
