import LoginForm from "@/components/LoginForm"
import PublicRoute from "@/components/PublicRoute"

export default function LoginPage() {
    return (
        <PublicRoute>
            <LoginForm />
        </PublicRoute>
    )
}