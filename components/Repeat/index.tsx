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

export type RepeatValue = Omit<RepeatType, "starts" | "ends"> & {
    starts: Date,
    ends?: Date
}

type RepeatProps = {
    value: RepeatValue,
    onChange: (value: RepeatValue) => void
}

export default function Repeat(props: RepeatProps) {
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily")
    const [interval, setInterval] = useState(1)
    const [weekdays, setWeekdays] = useState([ new Date().getDay() ])
    const [monthlyType, setMonthlyType] = useState<"days" | "weekday">("days")
    const [days, setDays] = useState([ new Date().getDate() ])
    const [ordinal, setOrdinal] = useState<Ordinal>(1)
    const [weekday, setWeekday] = useState(new Date().getDay())
    const [months, setMonths] = useState([ new Date().getMonth() ])
    const [yearlyType, setYearlyType] = useState<"day" | "weekday">("day")
    const [day, setDay] = useState(new Date().getDate())
    const [repeatStart, setRepeatStart] = useState(new Date())
    const [hasRepeatEnd, setHasRepeatEnd] = useState(false)
    const [repeatEnd, setRepeatEnd] = useState(new Date())
    const [open, setOpen] = useState<"start_repeating" | "stop_repeating" | undefined>(undefined)
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }

    return (
        <Collapses value={open}>
        <FieldFrame>
            <Fieldset
                description={"ergreg"}
            >
                <Option fieldset label="Frequency" value={frequencyLabelMap[frequency]}>
                    <Slide>
                        <SelectList
                            options={[
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                                { value: "monthly", label: "Monthly" },
                                { value: "yearly", label: "Yearly" }
                            ]}
                            value={frequency}
                            onChange={setFrequency}
                        />
                    </Slide>
                </Option>
                <Option fieldset label="Every" value={getIntervalLabel(frequency, interval)}>
                    <Slide>
                        <MultiSelect
                            options={{
                                days: Array.from({ length: 100 }).map((_, i) => ({
                                    value: i + 1,
                                    label: `${i + 1}`
                                }))
                            }}
                            value={{ days: interval }}
                            onChange={(val) => setInterval(val.days)}
                        />
                    </Slide>
                </Option>
                {frequency === "weekly" ? (
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
                                value={weekdays}
                                onChange={setWeekdays}
                            />
                        </Slide>
                    </Option>
                ) : frequency === "monthly" ? (
                    <>
                        <SelectBar
                            fieldset
                            options={[
                                { value: "days", label: "Each" },
                                { value: "weekday", label: "On The" }
                            ] as const}
                            value={monthlyType}
                            onChange={setMonthlyType}
                        />
                        {monthlyType === "days" ? (
                            <DaySelect fieldset multiple value={days} onChange={setDays} />
                        ) : monthlyType === "weekday" ? (
                            <NthWeekdaySelect
                                fieldset
                                value={{
                                    ordinal: ordinal,
                                    weekday: weekday
                                }}
                                onChange={({ ordinal, weekday }) => {
                                    setOrdinal(ordinal)
                                    setWeekday(weekday)
                                }}
                            />
                        ) : null}
                    </>
                ) : frequency === "yearly" ? (
                    <>
                        <Option
                            fieldset
                            label="Months"
                            value={getMonthsLabel(months)}
                        >
                            <Slide>
                                <SelectList
                                    multiple
                                    options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => ({
                                        value: i,
                                        label: month
                                    }))}
                                    value={months}
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
                            value={yearlyType}
                            onChange={setYearlyType}
                        />
                        {yearlyType === "day" ? (
                            <DaySelect fieldset value={day} onChange={setDay} />
                        ) : yearlyType === "weekday" ? (
                            <NthWeekdaySelect
                                fieldset
                                value={{
                                    ordinal: ordinal,
                                    weekday: weekday
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
                        label={Utility.formatDate(repeatStart)}
                        onClick={() => setOpen(open === "start_repeating" ? undefined : "start_repeating")}
                    />
                </LabelField>
                <Collapse value="start_repeating">
                    <DatePicker fieldset value={repeatStart} onChange={setRepeatStart} />
                </Collapse>
                <LabelField fieldset label="End">
                    <Toggle on={hasRepeatEnd} onChange={setHasRepeatEnd} />
                </LabelField>
                {hasRepeatEnd ? (
                    <>
                        <LabelField fieldset label="On">
                            <InnerButton
                                label={Utility.formatDate(repeatEnd)}
                                onClick={() => setOpen(open === "stop_repeating" ? undefined : "stop_repeating")}
                            />
                        </LabelField>
                        <Collapse value="stop_repeating">
                            <DatePicker fieldset min={repeatStart} value={repeatEnd} onChange={setRepeatEnd} />
                        </Collapse>
                    </>
                ) : null}
            </Fieldset>
        </FieldFrame>
        </Collapses>
    )
}