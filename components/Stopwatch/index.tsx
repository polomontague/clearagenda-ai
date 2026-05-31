"use client"
import { useEffect, Dispatch, SetStateAction } from "react"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"

type TaskStepStopwatchProps = {
    fieldset?: boolean,
    value: number,
    onChange: Dispatch<SetStateAction<number>>,
    running: boolean,
    onRunningChange: Dispatch<SetStateAction<boolean>>
}

export default function TaskStepStopwatch({ fieldset, value, onChange, running, onRunningChange }: TaskStepStopwatchProps) {
    useEffect(() => {
        if (!running) return
        const interval = setInterval(() => {
            onChange(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [running])

    const minutes = Math.floor(value / 60)
    const seconds = value % 60

    return (
        <LabelField fieldset={fieldset} label={`${minutes}:${seconds.toString().padStart(2, "0")}`}>
            <InnerButton
                label="Reset"
                onClick={() => {
                    onChange(0)
                    onRunningChange(false)
                }}
            />
            <InnerButton
                color={running ? "var(--red)" : "var(--green)"}
                label={running ? "Stop" : "Start"}
                onClick={() => onRunningChange(!running)}
            />
        </LabelField>
    )
}