"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import User from "@/types/User"
import { useCookies } from "react-cookie"
import axios from "axios"

type UserProviderProos = {
    children: ReactNode
}

const UserContext = createContext<{
    user?: User,
    setUser: Dispatch<SetStateAction<User | undefined>>
}>({
    user: undefined,
    setUser: () => {}
})

export const UserProvider = (props: UserProviderProos) => {
    const [user, setUser] = useState<User | undefined>()
    const [ cookies ] = useCookies()

    useEffect(() => {
        // Update Appearance
        if (user) {
            document.documentElement.setAttribute("data-theme", user.preferences.theme)
            document.documentElement.setAttribute("data-accent", user.preferences.accent)
        }
    }, [user])

    useEffect(() => {
        if (cookies.token) {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/me`, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setUser(res.data.data.user)
            })
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext