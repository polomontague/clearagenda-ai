import Item from "@/types/Item"
import clear from "./clear"
import Setters from "./Setters"

export default function populate(item: Item, setters: Setters) {
    clear(setters)
    setters.setType(item.type)
    if ("description" in item) setters.setDescription(item.description)
    if ("deadline" in item) setters.setHasDeadline(!!item.deadline)
    if ("deadline" in item) setters.setDeadline(item.deadline ? new Date(item.deadline) : new Date())
    setters.setName(item.name)
    if ("starts" in item) setters.setStarts(new Date(item.starts))
    if ("duration" in item) setters.setDuration(item.duration)
    setters.setOccurs(("repeat" in item && item.repeat) ? "repeating" : "once")
    if ("repeat" in item && item.repeat) {
        setters.setFrequency(item.repeat.frequency)
        setters.setInterval(item.repeat.interval)
        if ("ordinal" in item.repeat) setters.setOrdinal(item.repeat.ordinal)
        if ("weekday" in item.repeat) setters.setWeekday(item.repeat.weekday)
        if ("weekdays" in item.repeat) setters.setWeekdays(item.repeat.weekdays)
        if (item.repeat.frequency === "monthly") setters.setMonthlyType(item.repeat.type)
        if ("days" in item.repeat) setters.setDays(item.repeat.days)
        if ("months" in item.repeat) setters.setMonths(item.repeat.months)
        if ("day" in item.repeat) setters.setDay(item.repeat.day)
        if (item.repeat.frequency === "yearly") setters.setYearlyType(item.repeat.type)
        if (item.repeat.ends) {
            setters.setHasRepeatEnd(true)
            setters.setRepeatEnd(new Date(item.repeat.ends))
        }
    }
    if ("notes" in item && item.notes) setters.setNotes(item.notes)
}