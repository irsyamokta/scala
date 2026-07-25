import { useEffect, useState } from "react"

export default function usePersistentState<T>(
    key: string,
    defaultValue: T
): [T, (value: T) => void] {

    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") return defaultValue

        const stored = localStorage.getItem(key)

        return stored ? JSON.parse(stored) : defaultValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, setState]
}
