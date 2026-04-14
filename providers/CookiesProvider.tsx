"use client"
import { CookiesProvider as ReactCookieCookiesProvider } from "react-cookie"
import { ReactNode } from "react"

type CookiesProviderProps = {
    children: ReactNode
}

export default function CookiesProvider(props: CookiesProviderProps) {
    return (
        <ReactCookieCookiesProvider>
            {props.children}
        </ReactCookieCookiesProvider>
    )
}