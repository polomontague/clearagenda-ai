import { ReactNode } from "react"
import MarketingNavigationFrame from "@/components/MarketingNavigationFrame"

export default function MarketingLayout({ children }: {
    children: ReactNode
}) {
    return (
        <MarketingNavigationFrame>
            {children}
        </MarketingNavigationFrame>
    )
}