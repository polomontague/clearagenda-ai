import LoginForm from "@/components/LoginForm"
import PublicRoute from "@/components/PublicRoute"

export default function Login() {
    return (
        <PublicRoute>
            <LoginForm />
        </PublicRoute>
    )
}