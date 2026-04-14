import TabWindow from "@/components/TabWindow"
import { ReactNode } from "react"

type AuthLayoutProps = {
    children: ReactNode
}

export default function AuthLayout(props: AuthLayoutProps) {
    return (
        <TabWindow
            links={[
                { href: "/login", label: "Login" },
                { href: "/get-started", label: "Get Started" }
            ]}
        >
            {props.children}
        </TabWindow>
    )
}