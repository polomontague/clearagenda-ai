import DEFAULTS from "./DEFAULTS"
import Setters from "./Setters"

export default function clear({
    setType,
    setDescription,
    setHasDeadline,
    setDeadline,
    setName,
    setStarts,
    setDuration,
    setOccurs,
    setFrequency,
    setInterval,
    setOrdinal,
    setWeekday,
    setWeekdays,
    setMonthlyType,
    setDays,
    setMonths,
    setYearlyType,
    setDay,
    setRepeatStart,
    setNotes
}: Setters) {
    setType(DEFAULTS.type)
    setDescription(DEFAULTS.description)
    setHasDeadline(DEFAULTS.has_deadline)
    setDeadline(DEFAULTS.deadline)
    setName(DEFAULTS.name)
    setStarts(DEFAULTS.starts)
    setDuration(DEFAULTS.duration)
    setOccurs(DEFAULTS.occurs)
    setFrequency(DEFAULTS.frequency)
    setInterval(DEFAULTS.interval)
    setOrdinal(DEFAULTS.ordinal)
    setWeekday(DEFAULTS.weekday)
    setWeekdays(DEFAULTS.weekdays)
    setMonthlyType(DEFAULTS.monthly_type)
    setDays(DEFAULTS.days),
    setMonths(DEFAULTS.months)
    setYearlyType(DEFAULTS.yearly_type)
    setDay(DEFAULTS.day)
    setRepeatStart(DEFAULTS.repeat_start)
    setNotes(DEFAULTS.notes)
}