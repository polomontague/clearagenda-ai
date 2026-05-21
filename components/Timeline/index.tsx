"use client"
import { useState, useEffect } from "react"
import Event from "@/types/Event"
import styles from "./Timeline.module.css"
import Utility from "@/lib/Utility"
import { DateTime } from "luxon"

type TimelineProps = {
    events: Event[]
}

export default function Timeline(props: TimelineProps) {
    const [now, setNow] = useState(new Date())
    const MINUTES_IN_DAY = 60 * 24

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatHour = (hour: number) => {
        if (hour === 12) return (
            <span className={styles.containerHour}>
                <span className={styles.hour}>Noon</span>
            </span>
        )
        const amOrPm = hour < 12 ? "AM" : "PM"
        return (
            <span className={styles.containerHour}>
                <span className={styles.hour}>{hour % 12 || 12}&nbsp;</span>
                <span className={styles.amOrPm}>{amOrPm}</span>
            </span>
        )
    }

    const getHeight = (minutes: number) => {
        return (minutes / MINUTES_IN_DAY) * 100
    }

    const getTop = (date: Date) => {
        const minutes = date.getHours() * 60 + date.getMinutes()
        return (minutes / MINUTES_IN_DAY) * 100
    }

    const getEventTimes = (event: Event) => {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts)
            ends.setMinutes(ends.getMonth() + event.duration)
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        }
        if (event.occurs === "repeating") {

        }
    }

    return (
        <div className={styles.background}>
            <div className={styles.timeline}>
                <div className={styles.containerLines}>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className={styles.line}>
                            {formatHour(i)}
                        </div>
                    ))}
                    <div className={styles.line}>
                        {formatHour(0)}
                    </div>
                </div>
                <div className={styles.containerItems}>
                    {props.events.map((event, i) => {
                        const height = getHeight(event.duration)
                        const top = getTop(new Date(event.starts))
                        return (
                            (
                                <div
                                    key={i}
                                    className={styles.event}
                                    style={{
                                        height: `${height}%`,
                                        top: `${top}%`
                                    }}
                                >
                                    <h5 className={styles.name}>{event.name}</h5>
                                </div>
                            )
                        )
                    })}
                </div>
                <div
                    className={styles.indicator}
                    style={{
                        top: `${getTop(now)}%`
                    }}
                >
                    <span className={styles.time}>{now.getHours() % 12 || 12}:{now.getMinutes().toString().padStart(2, "0")}</span>
                </div>
            </div>
        </div>
    )
}