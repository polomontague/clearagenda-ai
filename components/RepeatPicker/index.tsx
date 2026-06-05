import Collapses, { Collapse } from "../Collapses"
import { useState } from "react"
import FieldFrame from "../FieldFrame"
import Utility from "@/lib/Utility"
import Fieldset from "../Fieldset"
import Repeat from "@/types/Repeat"
import SlideField from "../SlideField"
import SelectList from "../SelectList"
import { DEFAULTS } from "./DEFAULTS"
import MultiSelect from "../MultiSelect"
import SelectBar from "../SelectBar"
import DaySelect from "../DaySelect"
import NthWeekdaySelect from "../NthWeekdaySelect"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"
import DatePicker from "../DatePicker"
import Toggle from "../Toggle"

type RepeatProps = {
    timezone?: string,
    value: Repeat,
    onChange: (value: Repeat) => void
}

export default function RepeatPicker({ timezone, value, onChange }: RepeatProps) {
    const [open, setOpen] = useState<"start_repeating" | "stop_repeating" | undefined>(undefined)
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }
    const frequencyMap: Record<string, string> = {
        daily: "Day",
        weekly: "Week",
        monthly: "Month",
        yearly: "Year"
    }

    const handleFrequencyChange = (val: "daily" | "weekly" | "monthly" | "yearly") => {
        if (val === "daily") {
            onChange({
                frequency: "daily",
                interval: value.interval,
                starts: value.starts,
                ends: value.ends
            })
        }
        if (val === "weekly") {
            onChange({
                frequency: "weekly",
                interval: value.interval,
                weekdays: DEFAULTS.weekdays,
                starts: value.starts,
                ends: value.ends
            })
        }
        if (val === "monthly") {
            onChange({
                type: DEFAULTS.monthlyType,
                frequency: "monthly",
                interval: value.interval,
                days: DEFAULTS.days,
                starts: value.starts,
                ends: value.ends
            })
        }
        if (val === "yearly") {
            onChange({
                type: DEFAULTS.yearlyType,
                frequency: "yearly",
                interval: value.interval,
                months: DEFAULTS.months,
                day: DEFAULTS.day,
                starts: value.starts,
                ends: value.ends
            })
        }
    }

    const getIntervalLabel = (frequency: string, interval: number) => {
        const labelMap: Record<string, string> = {
            daily: "Day",
            weekly: "Week",
            monthly: "Month",
            yearly: "Year"
        }
        return `${interval > 1 ? `${interval} ` : ""}${labelMap[frequency]}${interval > 1 ? "s" : ""}`
    }

    const getWeekdaysLabel = (weekdays: number[]) => {
        const SHOW = 3
        const names = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
        if (weekdays.length === 7) return "Every Day"
        const remaining = weekdays.length - SHOW
        return `${weekdays.slice(0, SHOW).map(weekday => names[weekday]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
    }

    const handleMonthlyTypeChange = (val: "days" | "weekday") => {
        if (val === "days") {
            onChange({
                type: "days",
                frequency: "monthly",
                interval: value.interval,
                days: DEFAULTS.days,
                starts: value.starts,
                ends: value.ends
            })
        }
        if (val === "weekday") {
            onChange({
                type: "weekday",
                frequency: "monthly",
                interval: value.interval,
                ordinal: DEFAULTS.ordinal,
                weekday: DEFAULTS.weekday,
                starts: value.starts,
                ends: value.ends
            })
        }
    }

    const getMonthsLabel = (months: number[]) => {
        const SHOW = 3
        const names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        if (months.length === 12) return "Every Month"
        const remaining = months.length - SHOW
        return `${months.slice(0, SHOW).map(month => names[month]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
    }

    const handleYearlyTypeChange = (val: "day" | "weekday") => {
        if (val === "day") {
            onChange({
                type: "day",
                frequency: "yearly",
                interval: value.interval,
                months: DEFAULTS.months,
                day: DEFAULTS.day,
                starts: value.starts,
                ends: value.ends
            })
        }
        if (val === "weekday") {
            onChange({
                type: "weekday",
                frequency: "yearly",
                interval: value.interval,
                months: DEFAULTS.months,
                ordinal: DEFAULTS.ordinal,
                weekday: DEFAULTS.weekday,
                starts: value.starts,
                ends: value.ends
            })
        }
    }

    return (
        <Collapses value={open}>
            <FieldFrame>
                <Fieldset
                    description={Utility.getRepeatLabel(value, timezone)}
                >
                    <SlideField fieldset label="Frequency" value={frequencyLabelMap[value.frequency]}>
                        <SelectList
                            multiple={false}
                            options={[
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                                { value: "monthly", label: "Monthly" },
                                { value: "yearly", label: "Yearly" }
                            ] as const}
                            value={value.frequency}
                            onChange={handleFrequencyChange}
                        />
                    </SlideField>
                    <SlideField fieldset label="Every" value={getIntervalLabel(value.frequency, value.interval)}>
                        <MultiSelect
                            options={{
                                days: Array.from({ length: 100 }).map((_, i) => ({
                                    value: i + 1,
                                    label: `${i + 1} ${frequencyMap[value.frequency]}${i > 0 ? "s" : ""}`
                                }))
                            }}
                            value={{ days: value.interval }}
                            onChange={(val) => onChange({ ...value, interval: val.days })}
                        />
                    </SlideField>
                    {value.frequency === "weekly" ? (
                        <SlideField
                            fieldset
                            label="Weekdays"
                            value={getWeekdaysLabel(value.weekdays)}
                        >
                            <SelectList
                                multiple
                                options={(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const).map((weekday, i) => ({
                                    value: i,
                                    label: weekday
                                }))}
                                value={value.weekdays}
                                onChange={(val) => onChange({ ...value, weekdays: val })}
                            />
                        </SlideField>
                    ) : value.frequency === "monthly" ? (
                        <>
                            <SelectBar
                                fieldset
                                options={[
                                    { value: "days", label: "Each" },
                                    { value: "weekday", label: "On The" }
                                ] as const}
                                value={value.type}
                                onChange={handleMonthlyTypeChange}
                            />
                            {value.type === "days" ? (
                                <DaySelect fieldset multiple value={value.days} onChange={(val) => onChange({ ...value, days: val })} />
                            ) : value.type === "weekday" ? (
                                <NthWeekdaySelect
                                    fieldset
                                    value={{
                                        ordinal: value.ordinal,
                                        weekday: value.weekday
                                    }}
                                    onChange={({ ordinal, weekday }) => onChange({ ...value, ordinal, weekday })}
                                />
                            ) : null}
                        </>
                    ) : value.frequency === "yearly" ? (
                        <>
                            <SlideField
                                fieldset
                                label="Months"
                                value={getMonthsLabel(value.months)}
                            >
                                <SelectList
                                    multiple
                                    options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => ({
                                        value: i,
                                        label: month
                                    }))}
                                    value={value.months}
                                    onChange={(val) => onChange({ ...value, months: val })}
                                />
                            </SlideField>
                            <SelectBar
                                fieldset
                                options={[
                                    { value: "day", label: "Each" },
                                    { value: "weekday", label: "On The" }
                                ] as const}
                                value={value.type}
                                onChange={handleYearlyTypeChange}
                            />
                            {value.type === "day" ? (
                                <DaySelect fieldset value={value.day} onChange={(val) => onChange({ ...value, day: val })} />
                            ) : value.type === "weekday" ? (
                                <NthWeekdaySelect
                                    fieldset
                                    value={{
                                        ordinal: value.ordinal,
                                        weekday: value.weekday
                                    }}
                                    onChange={({ ordinal, weekday }) => onChange({ ...value, ordinal, weekday })}
                                />
                            ) : null}
                        </>
                    ) : null}
                </Fieldset>
                <Fieldset>
                    <LabelField fieldset label="Begin">
                        <InnerButton
                            label={Utility.formatDate(Utility.loadLocalDate(value.starts))}
                            onClick={() => setOpen(open === "start_repeating" ? undefined : "start_repeating")}
                        />
                    </LabelField>
                    <Collapse value="start_repeating">
                        <DatePicker fieldset value={Utility.loadLocalDate(value.starts)} onChange={(val) => onChange({ ...value, starts: Utility.getDateKey(val) })} />
                    </Collapse>
                    <LabelField fieldset label="End">
                        <Toggle on={Boolean(value.ends)} onChange={(val) => onChange({
                            ...value,
                            ends: val ? Utility.getDateKey(DEFAULTS.ends) : undefined
                        })} />
                    </LabelField>
                    {value.ends ? (
                        <>
                            <LabelField fieldset label="On">
                                <InnerButton
                                    label={Utility.formatDate(Utility.loadLocalDate(value.ends))}
                                    onClick={() => setOpen(open === "stop_repeating" ? undefined : "stop_repeating")}
                                />
                            </LabelField>
                            <Collapse value="stop_repeating">
                                <DatePicker fieldset min={Utility.loadLocalDate(value.starts)} value={Utility.loadLocalDate(value.ends)} onChange={(val) => onChange({ ...value, ends: Utility.getDateKey(val) })} />
                            </Collapse>
                        </>
                    ) : null}
                </Fieldset>
            </FieldFrame>
        </Collapses>
    )
}