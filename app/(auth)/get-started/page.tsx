import RegisterForm from "@/components/RegisterForm"
import PublicRoute from "@/components/PublicRoute"

export default function RegisterPage() {
    return (
        <PublicRoute>
            <RegisterForm />
        </PublicRoute>
    )
}