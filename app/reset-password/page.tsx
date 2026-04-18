import Window from "@/components/Window"
import PublicRoute from "@/components/PublicRoute"
import ResetPasswordForm from "@/components/ResetPasswordForm"
import FieldFrame from "@/components/FieldFrame"
import SecondaryLinkButton from "@/components/SecondaryLinkButton"

export default function ResetPasswordPage() {
    return (
        <PublicRoute>
            <Window label="Reset Password">
                <FieldFrame>
                    <ResetPasswordForm />
                    <SecondaryLinkButton href="/login" label="Login" />
                </FieldFrame>
            </Window>
        </PublicRoute>
    )
}