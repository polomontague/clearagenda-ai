"use client"
import { SubmitEvent, ReactNode } from "react"

type FormProps = {
    children: ReactNode
}

export default function Form(props: FormProps) {
    const handleSubmit = (evt: SubmitEvent) => {
        evt.preventDefault()
        
    }

    return (
        <form onSubmit={handleSubmit}>
            {props.children}
        </form>
    )
}