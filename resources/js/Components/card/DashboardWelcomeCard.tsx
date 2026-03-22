import Decoration from "../../../assets/svg/bg-decoration-card.svg";

interface DashboardWelcomeCardProps {
    title: string
    description: string
}

export default function DashboardWelcomeCard({
    title,
    description,
}: DashboardWelcomeCardProps) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-primary text-netral-100 px-6 py-8">

            {/* Decorative Background */}
            <img
                src={Decoration}
                alt="Decoration"
                className="absolute -left-8 -top-16 sm:-top-20"
            />
            <img
                src={Decoration}
                alt="Decoration"
                className="absolute right-32 -top-10 hidden sm:block"
            />

            <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-semibold">
                    {title}
                </h2>

                <p className="mt-1.5 text-sm md:text-base text-netral-200 font-medium">
                    {description}
                </p>
            </div>
        </div>
    )
}
