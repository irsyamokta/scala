type Props = {
    step: number
    total: number
}

export default function StepProgress({ step, total }: Props) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, index) => {
                const active = index === step

                return (
                    <div
                        key={index}
                        className={`h-1.5 w-10 rounded-full transition-all
            ${active ? "bg-primary" : "bg-netral-400"}`}
                    />
                )
            })}
        </div>
    )
}
