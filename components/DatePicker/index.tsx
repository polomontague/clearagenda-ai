"use client"
import styles from "./DatePicker.module.css"
import IconButton from "@/components/IconButton"
import { LeftArrowIcon, RightArrowIcon } from "@/components/Icons"
import { useState } from "react"
import MultiSelect from "@/components/MultiSelect"

type DatePickerProps = {
    fieldset?: boolean,
    value: Date,
    onChange: (value: Date) => void
}

export default function DatePicker(props: DatePickerProps) {
    const [date, setDate] = useState(new Date(props.value))
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    const [mode, setMode] = useState<"month" | "date">("date")
    const startYear = new Date().getFullYear() - 100
    const years = Array.from({ length: 201 }).map((_, i) => startYear + i)

    const getDays = (date: Date) => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        const days = []
        for (let i = 0; i < startDay; i++) days.push(null)
        for (let d = 1; d <= daysInMonth; d++) days.push(d)
        while (days.length % 7 !== 0) days.push(null)
        return days
    }

    const handleMonthClick = () => {
        setMode(mode === "month" ? "date" : "month")
    }

    const handleBackClick = () => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() - 1)
        setDate(newDate)
    }

    const handleNextClick = () => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() + 1)
        setDate(newDate)
    }

    const handleDateClick = (date2: number) => {
        const newValue = new Date(date)
        newValue.setDate(date2)
        props.onChange(newValue)
    }

    const handleMonthChange = (val: { month: number, year: number }) => {
        const newDate = new Date(date)
        newDate.setMonth(val.month)
        newDate.setFullYear(val.year)
        setDate(newDate)
    }

    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <header className={styles.header}>
                <div className={styles.wide}>
                    <button
                        type="button"
                        className={styles.btnMonth}
                        onClick={handleMonthClick}
                    >
                        {months[date.getMonth()]}, {date.getFullYear()}
                        <RightArrowIcon />
                    </button>
                </div>
                <IconButton
                    icon={<LeftArrowIcon />}
                    onClick={handleBackClick}
                />
                <IconButton
                    icon={<RightArrowIcon />}
                    onClick={handleNextClick}
                />
            </header>
            {mode === "month" ? (
                <MultiSelect
                    fieldset
                    options={{
                        month: months.map((month, i) => ({
                            value: i,
                            label: month
                        })),
                        year: years.map(year => ({
                            value: year,
                            label: year.toString()
                        }))
                    }}
                    value={{
                        month: date.getMonth(),
                        year: date.getFullYear()
                    }}
                    onChange={handleMonthChange}
                />
            ) : mode === "date" ? (
                <div className={styles.containerDates}>
                    <ul className={styles.lstWeekdays}>
                        {[ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ].map((weekday, i) => (
                            <li key={i}>
                                <span className={styles.label}>{weekday.toUpperCase()}</span>
                            </li>
                        ))}
                    </ul>
                    <ul className={styles.lstDates}>
                        {getDays(date).map((day, i) => {
                            const currentDate = new Date()
                            const today = (date.getFullYear() === currentDate.getFullYear()) && (date.getMonth() === currentDate.getMonth()) && (day === currentDate.getDate())
                            const selected = (props.value.getFullYear() === date.getFullYear()) && (props.value.getMonth() === date.getMonth()) && (day === props.value.getDate())
                            return (
                                <li key={i}>
                                    {day ? (
                                        <button
                                            type="button"
                                            className={`${styles.btnDate} ${today ? styles.today : ""} ${selected ? styles.selected : ""}`}
                                            onClick={() => handleDateClick(day)}
                                        >
                                            {day}
                                        </button>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}