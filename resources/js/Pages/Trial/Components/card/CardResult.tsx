import { Link } from "@inertiajs/react";
import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import { PiInfoFill } from "react-icons/pi";

interface SRQResult {
    gme: boolean;
    zat: boolean;
    psikotik: boolean;
    ptsd: boolean;
}

interface Props {
    result: SRQResult;
}

export default function ResultCard({ result }: Props) {

    const results = [
        {
            label: "Mental Emosional",
            status: result.gme,
            description:
                "Terdapat indikasi Gangguan Mental Emosional (GME) berdasarkan jumlah jawaban YA pada pertanyaan 1–20.",
        },
        {
            label: "Zat Psikoaktif",
            status: result.zat,
            description:
                "Terdapat indikasi penggunaan zat psikoaktif atau narkoba.",
        },
        {
            label: "Gejala Psikotik",
            status: result.psikotik,
            description:
                "Terdapat indikasi gejala gangguan psikotik yang memerlukan perhatian lebih lanjut.",
        },
        {
            label: "Gejala PTSD",
            status: result.ptsd,
            description:
                "Terdapat indikasi gejala Post Traumatic Stress Disorder (PTSD).",
        },
    ];

    return (
        <section className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-netral-100 border border-netral-300 rounded-2xl p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="mx-auto">
                    <Badge className="bg-netral-100 text-netral-600 border border-netral-300 py-2 px-4 mb-6 shadow-lg">
                        <div
                            className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            Hasil Skrining Tes
                        </div>
                    </Badge>
                </div>

                {/* Result List */}
                <div className="flex flex-col gap-4">
                    {results.map((item, index) => (
                        <div
                            key={index}
                            className={`border rounded-xl p-3 flex flex-col gap-1
                            ${item.status
                                    ? "border-red-300 bg-red-50"
                                    : "border-green-300 bg-green-50"
                                }`}
                        >

                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">
                                    {item.label}
                                </h3>

                                <span
                                    className={`text-sm font-semibold
                                    ${item.status
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                >
                                    {item.status ? "Terindikasi" : "Tidak Terindikasi"}
                                </span>
                            </div>

                            <p className="text-sm text-netral-600">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full md:w-60"
                        >
                            Kembali ke Beranda
                        </Button>
                    </Link>

                    <Link href="/login" className="flex-1">
                        <Button
                            size="lg"
                            className="w-full"
                        >
                            Evaluasi Lebih Lanjut
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-2 text-netral-700 mx-auto">
                    <PiInfoFill size={20} className="text-primary shrink-0" />
                    <p className="text-sm md:text-base">
                        Hasil bersifat indikatif dan tidak menggantikan evaluasi profesional.
                    </p>
                </div>
            </div>
        </section>
    );
}
