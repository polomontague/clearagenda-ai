import RegisterForm from "@/components/RegisterForm"
import PublicRoute from "@/components/PublicRoute"
import Window from "@/components/Window"
import LinkBar from "@/components/LinkBar"
import FieldFrame from "@/components/FieldFrame"

export default function RegisterPage() {
    return (
        <PublicRoute>
            <Window label="Get Started">
                <FieldFrame>
                    <LinkBar
                        options={[
                            { href: "/login", label: "Login" },
                            { href: "/get-started", label: "Get Started" }
                        ]}
                    />
                    <RegisterForm />
                </FieldFrame>
            </Window>
        </PublicRoute>
    )
}