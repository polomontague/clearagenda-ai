"use client"
import { SubmitEvent, ReactNode } from "react"

type FormProps = {
    onSubmit: () => void,
    children: ReactNode
}

export default function Form(props: FormProps) {
    const handleSubmit = (evt: SubmitEvent<HTMLFormElement>) => {
        evt.preventDefault()
        props.onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            {props.children}
        </form>
    )
}