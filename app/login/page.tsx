import LoginForm from "@/components/LoginForm"
import PublicRoute from "@/components/PublicRoute"
import Window from "@/components/Window"
import LinkBar from "@/components/LinkBar"
import FieldFrame from "@/components/FieldFrame"
import SecondaryLinkButton from "@/components/SecondaryLinkButton"

export default function LoginPage() {
    return (
        <PublicRoute>
            <Window label="Login">
                <FieldFrame>
                    <LinkBar
                        options={[
                            { href: "/login", label: "Login" },
                            { href: "/get-started", label: "Get Started" }
                        ]}
                    />
                    <LoginForm />
                    <SecondaryLinkButton href="/forgot-password" label="Forgot Password" />
                </FieldFrame>
            </Window>
        </PublicRoute>
    )
}