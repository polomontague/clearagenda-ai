"use client"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"
import Routes from "@/constants/Routes"

type PublicRouteProps = {
    children: ReactNode
}

export default function PublicRoute(props: PublicRouteProps) {
    const [ cookies ] = useCookies()
    const router = useRouter()

    useEffect(() => {
        if (cookies.token) router.push(Routes.AUTH_LANDING_PAGE)
    }, [cookies.token, router])

    return props.children
}