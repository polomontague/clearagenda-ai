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
        const start = Date.now() - value
        const interval = setInterval(() => {
            onChange(Date.now() - start)
        }, 10)
        return () => clearInterval(interval)
    }, [running])

    const hours = Math.floor(value / (1000 * 60 * 60))
    const minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((value % (1000 * 60)) / 1000)
    const milliseconds = value % 1000

    const displayHours = hours.toString().padStart(2, "0")
    const displayMinutes = minutes.toString().padStart(2, "0")
    const displaySeconds = seconds.toString().padStart(2, "0")
    const displayHundreths = Math.floor(milliseconds / 10).toString().padStart(2, "0")

    return (
        <LabelField
            fieldset={fieldset}
            label={`${displayHours}:${displayMinutes}:${displaySeconds}.${displayHundreths}`}
        >
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