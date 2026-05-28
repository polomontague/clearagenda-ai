import { ReactElement } from "react"
import MarketingNavigationFrame from "@/components/MarketingNavigationFrame"

export default function MarketingLayout({ children }: {
    children: ReactElement
}) {
    return (
        <MarketingNavigationFrame>
            {children}
        </MarketingNavigationFrame>
    )
}