import Fieldset from "@/components/Fieldset"
import Utility from "@/lib/Utility"
import getRepeat from "./getRepeat"
import SelectBar from "@/components/SelectBar"
import Values, { RepeatValues } from "./Values"
import Setters, { RepeatSetters } from "./Setters"
import LabelField from "@/components/LabelField"
import InnerButton from "@/components/InnerButton"
import { Collapse } from "@/components/Collapses"
import { Option, Slide } from "@/components/FormModal"
import TimePicker from "@/components/TimePicker"
import DurationSelect from "@/components/DurationSelect"
import SelectList from "@/components/SelectList"
import getIntervalLabel from "./getIntervalLabel"
import MultiSelect from "@/components/MultiSelect"
import getWeekdaysLabel from "./getWeekdaysLabel"
import NthWeekdaySelect from "@/components/NthWeekdaySelect"
import DaySelect from "@/components/DaySelect"
import getMonthsLabel from "./getMonthsLabel"
import DatePicker from "@/components/DatePicker"
import Toggle from "@/components/Toggle"
import FieldFrame from "../FieldFrame"

type OccursValues = RepeatValues & Pick<Values, "occurs" | "deadline" | "starts" | "duration" | "type" | "hasDeadline"> & {
    open?: string
}

type OccursSetters = RepeatSetters & Pick<Setters, "setOccurs" | "setDeadline" | "setStarts" | "setDuration" | "setHasDeadline"> & {
    setOpen: (value: string | undefined) => void
}

export default function renderOccurs(values: OccursValues, setters: OccursSetters) {
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }

    return (
        <Fieldset
            description={values.occurs === "repeating" ? Utility.getRepeatLabel(getRepeat({
                frequency: values.frequency,
                repeatStart: values.repeatStart,
                hasRepeatEnd: values.hasRepeatEnd,
                repeatEnd: values.repeatEnd,
                interval: values.interval,
                weekdays: values.weekdays,
                monthlyType: values.monthlyType,
                days: values.days,
                ordinal: values.ordinal,
                weekday: values.weekday,
                yearlyType: values.yearlyType,
                months: values.months,
                day: values.day
            })) : undefined}
        >
            <SelectBar
                fieldset
                options={[
                    { value: "once", label: "One Time" },
                    { value: "repeating", label: "Repeating" }
                ] as const}
                value={values.occurs}
                onChange={setters.setOccurs}
            />
            {values.occurs === "once" ? (
                values.type === "task" ? (
                    <>
                        <LabelField fieldset label="Deadline">
                            <Toggle on={values.hasDeadline} onChange={setters.setHasDeadline} />
                        </LabelField>
                        {values.hasDeadline ? (
                            <>
                                <LabelField fieldset label="Date">
                                    <InnerButton
                                        label={Utility.formatDate(values.deadline)}
                                        onClick={() => setters.setOpen(values.open === "deadline" ? undefined : "deadline")}
                                    />
                                </LabelField>
                                <Collapse value="deadline">
                                    <DatePicker fieldset value={values.deadline} onChange={setters.setDeadline} />
                                </Collapse>
                            </>
                        ) : null}
                    </>
                ) : values.type === "event" ? (
                    <>
                        <LabelField fieldset label="Starts">
                            <InnerButton
                                label={Utility.formatDate(values.starts)}
                                onClick={() => setters.setOpen(values.open === "starts_date" ? undefined : "starts_date")}
                            />
                            <InnerButton
                                label={Utility.formatTime(values.starts)}
                                onClick={() => setters.setOpen(values.open === "starts_time" ? undefined : "starts_time")}
                            />
                        </LabelField>
                        <Collapse value="starts_date">
                            <DatePicker fieldset value={values.starts} onChange={(val) => setters.setStarts(val)} />
                        </Collapse>
                        <Collapse value="starts_time">
                            <TimePicker fieldset value={values.starts} onChange={(val) => setters.setStarts(val)} />
                        </Collapse>
                        <Option
                            fieldset
                            label="Length"
                            value={Utility.formatDuration(values.duration)}
                        >
                            <Slide>
                                <DurationSelect value={values.duration} onChange={setters.setDuration} />
                            </Slide>
                        </Option>
                    </>
                ) : null
            ) : values.occurs === "repeating" ? (
                <>
                    {values.type === "event" ? (
                        <>
                            <LabelField fieldset label="Starts">
                                <InnerButton
                                    label={Utility.formatTime(values.starts)}
                                    onClick={() => setters.setOpen(values.open === "repeat_start" ? undefined : "repeat_start")}
                                />
                            </LabelField>
                            <Collapse value="repeat_start">
                                <TimePicker fieldset value={values.starts} onChange={(val) => setters.setStarts(val)} />
                            </Collapse>
                            <Option
                                fieldset
                                label="Length"
                                value={Utility.formatDuration(values.duration)}
                            >
                                <Slide>
                                    <DurationSelect value={values.duration} onChange={setters.setDuration} />
                                </Slide>
                            </Option>
                        </>
                    ) : null}
                    <Option
                        fieldset
                        label="Repeat"
                        value={Utility.getShortRepeatLabel(getRepeat({
                            frequency: values.frequency,
                            repeatStart: values.repeatStart,
                            hasRepeatEnd: values.hasRepeatEnd,
                            repeatEnd: values.repeatEnd,
                            interval: values.interval,
                            weekdays: values.weekdays,
                            monthlyType: values.monthlyType,
                            days: values.days,
                            ordinal: values.ordinal,
                            weekday: values.weekday,
                            yearlyType: values.yearlyType,
                            months: values.months,
                            day: values.day
                        }))}
                    >
                        <Slide>
                            <FieldFrame>
                                <Fieldset
                                    description={values.occurs === "repeating" ? Utility.getRepeatLabel(getRepeat({
                                        frequency: values.frequency,
                                        repeatStart: values.repeatStart,
                                        hasRepeatEnd: values.hasRepeatEnd,
                                        repeatEnd: values.repeatEnd,
                                        interval: values.interval,
                                        weekdays: values.weekdays,
                                        monthlyType: values.monthlyType,
                                        days: values.days,
                                        ordinal: values.ordinal,
                                        weekday: values.weekday,
                                        yearlyType: values.yearlyType,
                                        months: values.months,
                                        day: values.day
                                    })) : undefined}
                                >
                                    <Option
                                        fieldset
                                        label="Frequency"
                                        value={frequencyLabelMap[values.frequency]}
                                    >
                                        <Slide>
                                            <SelectList
                                                options={[
                                                    { value: "daily", label: "Daily" },
                                                    { value: "weekly", label: "Weekly" },
                                                    { value: "monthly", label: "Monthly" },
                                                    { value: "yearly", label: "Yearly" }
                                                ]}
                                                value={values.frequency}
                                                onChange={setters.setFrequency}
                                            />
                                        </Slide>
                                    </Option>
                                    <Option
                                        fieldset
                                        label="Every"
                                        value={getIntervalLabel(values.frequency, values.interval)}
                                    >
                                        <Slide>
                                            <MultiSelect
                                                options={{
                                                    days: Array.from({ length: 100 }).map((_, i) => ({
                                                        value: i + 1,
                                                        label: `${i + 1}`
                                                    }))
                                                }}
                                                value={{ days: values.interval }}
                                                onChange={(val) => setters.setInterval(val.days)}
                                            />
                                        </Slide>
                                    </Option>
                                    {values.frequency === "weekly" ? (
                                        <Option
                                            fieldset
                                            label="Weekdays"
                                            value={getWeekdaysLabel(values.weekdays)}
                                        >
                                            <Slide>
                                                <SelectList
                                                    multiple
                                                    options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((weekday, i) => ({
                                                        value: i,
                                                        label: weekday
                                                    }))}
                                                    value={values.weekdays}
                                                    onChange={(val) => setters.setWeekdays(val)}
                                                />
                                            </Slide>
                                        </Option>
                                    ) : values.frequency === "monthly" ? (
                                        <>
                                            <SelectBar
                                                fieldset
                                                options={[
                                                    { value: "days", label: "Each" },
                                                    { value: "weekday", label: "On The" }
                                                ] as const}
                                                value={values.monthlyType}
                                                onChange={setters.setMonthlyType}
                                            />
                                            {values.monthlyType === "days" ? (
                                                <DaySelect fieldset multiple value={values.days} onChange={setters.setDays} />
                                            ) : values.monthlyType === "weekday" ? (
                                                <NthWeekdaySelect
                                                    fieldset
                                                    value={{
                                                        ordinal: values.ordinal,
                                                        weekday: values.weekday
                                                    }}
                                                    onChange={({ ordinal, weekday }) => {
                                                        setters.setOrdinal(ordinal)
                                                        setters.setWeekday(weekday)
                                                    }}
                                                />
                                            ) : null}
                                        </>
                                    ) : values.frequency === "yearly" ? (
                                        <>
                                            <Option
                                                fieldset
                                                label="Months"
                                                value={getMonthsLabel(values.months)}
                                            >
                                                <Slide>
                                                    <SelectList
                                                        multiple
                                                        options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => ({
                                                            value: i,
                                                            label: month
                                                        }))}
                                                        value={values.months}
                                                        onChange={(val) => setters.setMonths(val)}
                                                    />
                                                </Slide>
                                            </Option>
                                            <SelectBar
                                                fieldset
                                                options={[
                                                    { value: "day", label: "Each" },
                                                    { value: "weekday", label: "On The" }
                                                ] as const}
                                                value={values.yearlyType}
                                                onChange={setters.setYearlyType}
                                            />
                                            {values.yearlyType === "day" ? (
                                                <DaySelect fieldset value={values.day} onChange={setters.setDay} />
                                            ) : values.yearlyType === "weekday" ? (
                                                <NthWeekdaySelect
                                                    fieldset
                                                    value={{
                                                        ordinal: values.ordinal,
                                                        weekday: values.weekday
                                                    }}
                                                    onChange={({ ordinal, weekday }) => {
                                                        setters.setOrdinal(ordinal)
                                                        setters.setWeekday(weekday)
                                                    }}
                                                />
                                            ) : null}
                                        </>
                                    ) : null}
                                </Fieldset>
                                <Fieldset>
                                    <LabelField fieldset label="Begin">
                                        <InnerButton
                                            label={Utility.formatDate(values.repeatStart)}
                                            onClick={() => setters.setOpen(values.open === "start_repeating" ? undefined : "start_repeating")}
                                        />
                                    </LabelField>
                                    <Collapse value="start_repeating">
                                        <DatePicker fieldset value={values.repeatStart} onChange={setters.setRepeatStart} />
                                    </Collapse>
                                    <LabelField fieldset label="End">
                                        <Toggle on={values.hasRepeatEnd} onChange={(val) => setters.setHasRepeatEnd(val)} />
                                    </LabelField>
                                    {values.hasRepeatEnd ? (
                                        <>
                                            <LabelField fieldset label="On">
                                                <InnerButton
                                                    label={Utility.formatDate(values.repeatEnd)}
                                                    onClick={() => setters.setOpen(values.open === "stop_repeating" ? undefined : "stop_repeating")}
                                                />
                                            </LabelField>
                                            <Collapse value="stop_repeating">
                                                <DatePicker fieldset min={values.repeatStart} value={values.repeatEnd} onChange={setters.setRepeatEnd} />
                                            </Collapse>
                                        </>
                                    ) : null}
                                </Fieldset>
                            </FieldFrame>
                        </Slide>
                    </Option>
                </>
            ) : null}
        </Fieldset>
    )
}