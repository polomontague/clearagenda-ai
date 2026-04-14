"use client"
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import User from "@/types/User"
import API from "@/lib/API"

type UserProviderProps = {
    children: ReactNode
}

const UserContext = createContext<{
    user?: User,
    setUser: Dispatch<SetStateAction<User | undefined>>
}>({
    user: undefined,
    setUser: () => {}
})

export const UserProvider = (props: UserProviderProps) => {
    const [user, setUser] = useState<User | undefined>()

    useEffect(() => {
        API.get<{ user: User }>("/api/v1/me", true).then(data => {
            setUser(data.user)
        })
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext