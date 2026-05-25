"use client"
import styles from "./Timeline.module.css"
import { useState, useEffect } from "react"
import Utility from "@/lib/Utility"

export type Block = {
    starts: Date,
    ends: Date,
    label: string
}

export type Point = {
    at: Date,
    label: string
}

type TimelineProps = {
    date: Date,
    blocks: Block[],
    points: Point[]
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

    const getHeight = (starts: Date, ends: Date) => {
        const duration = (ends.getTime() - starts.getTime()) / (1000 * 60) // in minutes
        return (duration / MINUTES_IN_DAY) * 100
    }

    const getTop = (starts: Date, day: Date) => {
        const dayStart = new Date(day)
        dayStart.setHours(0, 0, 0, 0)
        const diffMinutes = (starts.getTime() - dayStart.getTime()) / (1000 * 60)
        return (diffMinutes / MINUTES_IN_DAY) * 100
    }

    const getFrom = (starts: Date, ends: Date, day: Date): string => {
        let start = new Date(starts)
        const startsBeforeDay = Utility.getDateKey(starts) < Utility.getDateKey(day)
        if (startsBeforeDay) {
            start = new Date(day)
            start.setHours(0, 0, 0, 0)
        }
        let end = new Date(ends)
        const endsAfterDay = Utility.getDateKey(ends) > Utility.getDateKey(day)
        if (endsAfterDay) {
            end = new Date(day)
            end.setDate(end.getDate() + 1)
            end.setHours(0, 0, 0, 0)
        }
        return `${Utility.formatTime(start)} - ${Utility.formatTime(end)}`
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
                    {props.blocks.map((block, i) => {
                        const height = getHeight(block.starts, block.ends)
                        const top = getTop(new Date(block.starts), props.date)
                        return (
                            <div
                                key={i}
                                className={styles.block}
                                style={{
                                    height: `${height}%`,
                                    top: `${top}%`
                                }}
                            >
                                <h5 className={styles.label}>{block.label}</h5>
                                <h6 className={styles.from}>{getFrom(block.starts, block.ends, props.date)}</h6>
                            </div>
                        )
                    })}
                    {props.points.map((point, i) => {
                        const top = getTop(point.at, props.date)
                        return (
                            <div
                                key={i}
                                className={styles.point}
                                style={{
                                    top: `${top}%`
                                }}
                            >
                                <div className={styles.dot}></div>
                                <h5 className={styles.label}>{point.label} @ {Utility.formatTime(point.at)}</h5>
                            </div>
                        )
                    })}
                </div>
                <div
                    className={styles.indicator}
                    style={{
                        top: `${getTop(now, now)}%`
                    }}
                >
                    <span className={styles.time}>{now.getHours() % 12 || 12}:{now.getMinutes().toString().padStart(2, "0")}</span>
                </div>
            </div>
        </div>
    )
}