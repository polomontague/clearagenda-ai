"use client"
import { useContext } from "react"
import UserContext from "@/contexts/UserContext"
import LinkButton from "../LinkButton"

export default function AuthButton() {
    const { user } = useContext(UserContext)

    return user ? (
        <LinkButton narrow href="/agenda" label="Go To Agenda" />
    ) : (
        <LinkButton narrow href="/get-started" label="Get Started" />
    )
}