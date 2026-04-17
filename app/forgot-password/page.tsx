import Window from "@/components/Window"
import ForgotPasswordForm from "@/components/ForgotPasswordForm"
import PublicRoute from "@/components/PublicRoute"
import FieldFrame from "@/components/FieldFrame"
import SecondaryLinkButton from "@/components/SecondaryLinkButton"

export default function ForgotPasswordPage() {
    return (
        <PublicRoute>
            <Window label="Forgot Password">
                <FieldFrame>
                    <ForgotPasswordForm />
                    <SecondaryLinkButton href="/login" label="Login" />
                </FieldFrame>
            </Window>
        </PublicRoute>
    )
}