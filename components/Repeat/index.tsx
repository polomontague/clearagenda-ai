"use client"
import { useState, useEffect } from "react"
import RepeatType from "@/types/Repeat"
import FieldFrame from "../FieldFrame"
import { Option, Slide } from "../FormModal"
import Fieldset from "../Fieldset"
import SelectList from "../SelectList"
import MultiSelect from "../MultiSelect"
import SelectBar from "../SelectBar"
import DaySelect from "../DaySelect"
import NthWeekdaySelect from "../NthWeekdaySelect"
import { Ordinal } from "@/types/Repeat"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"
import Utility from "@/lib/Utility"
import Collapses, { Collapse } from "../Collapses"
import DatePicker from "../DatePicker"
import Toggle from "../Toggle"
import getIntervalLabel from "./getIntervalLabel"
import getWeekdaysLabel from "./getWeekdaysLabel"
import getMonthsLabel from "./getMonthsLabel"
import DEFAULTS from "./DEFULTS"
import getRepeat from "./getRepeat"

type RepeatProps = {
    timezone?: string,
    value: RepeatType,
    onChange: (value: RepeatType) => void
}

export default function Repeat({ timezone, value, onChange }: RepeatProps) {
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(DEFAULTS.frequency)
    const [interval, setInterval] = useState(DEFAULTS.interval)
    const [weekdays, setWeekdays] = useState(DEFAULTS.weekdays)
    const [monthlyType, setMonthlyType] = useState<"days" | "weekday">(DEFAULTS.monthlyType)
    const [days, setDays] = useState(DEFAULTS.days)
    const [ordinal, setOrdinal] = useState<Ordinal>(DEFAULTS.ordinal)
    const [weekday, setWeekday] = useState(DEFAULTS.weekday)
    const [months, setMonths] = useState(DEFAULTS.months)
    const [yearlyType, setYearlyType] = useState<"day" | "weekday">(DEFAULTS.yearlyType)
    const [day, setDay] = useState(DEFAULTS.day)
    const [starts, setStarts] = useState(DEFAULTS.starts)
    const [hasEnds, setHasEnds] = useState(DEFAULTS.hasEnds)
    const [ends, setEnds] = useState(DEFAULTS.ends)
    const [open, setOpen] = useState<"start_repeating" | "stop_repeating" | undefined>(undefined)
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }

    useEffect(() => {
        onChange(getRepeat({ frequency, interval, weekdays, monthlyType, days, ordinal, weekday, months, yearlyType, day, starts, hasEnds, ends }))
    }, [frequency, interval, weekdays, monthlyType, days, ordinal, weekday, months, yearlyType, day, starts, hasEnds, ends])

    return (
        <Collapses value={open}>
        <FieldFrame>
            <Fieldset
                description={Utility.getRepeatLabel(value, timezone)}
            >
                <Option fieldset label="Frequency" value={frequencyLabelMap[value.frequency]}>
                    <Slide>
                        <SelectList
                            options={[
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                                { value: "monthly", label: "Monthly" },
                                { value: "yearly", label: "Yearly" }
                            ]}
                            value={value.frequency}
                            onChange={setFrequency}
                        />
                    </Slide>
                </Option>
                <Option fieldset label="Every" value={getIntervalLabel(value.frequency, value.interval)}>
                    <Slide>
                        <MultiSelect
                            options={{
                                days: Array.from({ length: 100 }).map((_, i) => ({
                                    value: i + 1,
                                    label: `${i + 1}`
                                }))
                            }}
                            value={{ days: value.interval }}
                            onChange={(val) => setInterval(val.days)}
                        />
                    </Slide>
                </Option>
                {value.frequency === "weekly" ? (
                    <Option
                        fieldset
                        label="Weekdays"
                        value={getWeekdaysLabel(weekdays)}
                    >
                        <Slide>
                            <SelectList
                                multiple
                                options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((weekday, i) => ({
                                    value: i,
                                    label: weekday
                                }))}
                                value={value.weekdays}
                                onChange={setWeekdays}
                            />
                        </Slide>
                    </Option>
                ) : value.frequency === "monthly" ? (
                    <>
                        <SelectBar
                            fieldset
                            options={[
                                { value: "days", label: "Each" },
                                { value: "weekday", label: "On The" }
                            ] as const}
                            value={value.type}
                            onChange={setMonthlyType}
                        />
                        {value.type === "days" ? (
                            <DaySelect fieldset multiple value={value.days} onChange={setDays} />
                        ) : value.type === "weekday" ? (
                            <NthWeekdaySelect
                                fieldset
                                value={{
                                    ordinal: value.ordinal,
                                    weekday: value.weekday
                                }}
                                onChange={({ ordinal, weekday }) => {
                                    setOrdinal(ordinal)
                                    setWeekday(weekday)
                                }}
                            />
                        ) : null}
                    </>
                ) : value.frequency === "yearly" ? (
                    <>
                        <Option
                            fieldset
                            label="Months"
                            value={getMonthsLabel(value.months)}
                        >
                            <Slide>
                                <SelectList
                                    multiple
                                    options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => ({
                                        value: i,
                                        label: month
                                    }))}
                                    value={value.months}
                                    onChange={(val) => setMonths(val)}
                                />
                            </Slide>
                        </Option>
                        <SelectBar
                            fieldset
                            options={[
                                { value: "day", label: "Each" },
                                { value: "weekday", label: "On The" }
                            ] as const}
                            value={value.type}
                            onChange={setYearlyType}
                        />
                        {value.type === "day" ? (
                            <DaySelect fieldset value={value.day} onChange={setDay} />
                        ) : value.type === "weekday" ? (
                            <NthWeekdaySelect
                                fieldset
                                value={{
                                    ordinal: value.ordinal,
                                    weekday: value.weekday
                                }}
                                onChange={({ ordinal, weekday }) => {
                                    setOrdinal(ordinal)
                                    setWeekday(weekday)
                                }}
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
                    <DatePicker fieldset value={Utility.loadLocalDate(value.starts)} onChange={setStarts} />
                </Collapse>
                <LabelField fieldset label="End">
                    <Toggle on={Boolean(value.ends)} onChange={setHasEnds} />
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
                            <DatePicker fieldset min={Utility.loadLocalDate(value.starts)} value={loadLocalDate(value.ends)} onChange={setEnds} />
                        </Collapse>
                    </>
                ) : null}
            </Fieldset>
        </FieldFrame>
        </Collapses>
    )
}