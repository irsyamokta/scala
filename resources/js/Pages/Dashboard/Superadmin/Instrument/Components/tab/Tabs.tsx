import clsx from "clsx"
import { capitalizeEachWord } from "@/utils/capitalize"

interface TabItem {
    label: string
    value: number
}

interface Props {
    tabs: TabItem[]
    active: number
    onChange: (value: number) => void
}

export default function Tabs({ tabs, active, onChange }: Props) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-2 bg-netral-200 p-1 rounded-xl w-max">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={clsx(
                            "px-4 py-2 text-sm rounded-lg transition whitespace-nowrap",
                            active === tab.value
                                ? "bg-white shadow-sm text-netral-900 font-medium"
                                : "text-netral-500 hover:text-netral-800"
                        )}
                    >
                        {capitalizeEachWord(tab.label)}
                    </button>
                ))}
            </div>
        </div>
    )
}