"use client"
import { useCookies } from "react-cookie"
import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"

type PrivateRouteProps = {
    children: ReactNode
}

export default function PrivateRoute(props: PrivateRouteProps) {
    const [ cookies ] = useCookies()
    const router = useRouter()

    useEffect(() => {
        if (!cookies.token) router.push("/login")
    }, [router])
    
    return props.children
}