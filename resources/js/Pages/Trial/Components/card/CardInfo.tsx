import { Link } from "@inertiajs/react";
import Button from "@/Components/ui/button/Button";

interface ListContent {
    number: string;
    content: string;
}

const DATA: ListContent[] = [
    {
        number: "01",
        content: "Tes ini merupakan Self-Reporting Questionnaire (SRQ-29) yang digunakan untuk membantu mengidentifikasi indikasi awal gangguan mental emosional pada individu dewasa.",
    },
    {
        number: "02",
        content: "Jawablah setiap pertanyaan sesuai dengan kondisi yang Anda alami dalam beberapa minggu terakhir.",
    },
    {
        number: "03",
        content: "Tidak ada jawaban benar atau salah, pilih yang paling sesuai dengan pengalaman Anda.",
    },
]
export default function CardInfo() {
    return (
        <section className="relative max-w-4xl mx-auto px-6 lg:px-20 py-12 mb-10">
            <div
                data-aos="fade-up"
                className="bg-netral-100 rounded-2xl p-6 flex flex-col gap-5 border border-netral-300 w-full justify-self-end">
                {/* Icon */}
                <div className="flex flex-col items-center gap-3">
                    <h1 className="header-5">Preview Tes SRQ-29</h1>
                    <p className="paragraph-1 text-netral-600 text-center">
                        Skrining singkat untuk memahami kondisi mental <br />
                        emosional secara lebih mendalam.
                    </p>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    {DATA.map((item, index) => (
                        <div className="flex items-start border border-netral-300  p-3 rounded-xl gap-5">
                            {/* Icon */}
                            <div key={index} className="w-12 h-12 flex justify-center items-center font-semibold text-2xl text-primary p-4 bg-secondary rounded-lg">
                                {item.number}
                            </div>

                            {/* Description */}
                            <p className="paragraph-1">
                                {item.content}
                            </p>
                        </div>
                    ))}
                    <div className="flex flex-col-reverse md:flex-row gap-4 mt-6">
                        <Link href="/">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full md:w-40"
                            >
                                Kembali
                            </Button>
                        </Link>
                        <Link href="/srq-test" className="md:flex-1">
                            <Button
                                size="lg"
                                className="w-full"
                            >
                                Mulai Tes
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    )
}
