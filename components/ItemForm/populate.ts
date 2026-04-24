import Item from "@/types/Item"
import clear from "./clear"
import Setters from "./Setters"

export default function populate(item: Item, setters: Setters) {
    clear(setters)
    setters.setType(item.type)
    if (item.type === "task") {
        setters.setDescription(item.description)
        if ("deadline" in item) setters.setHasDeadline(!!item.deadline)
        if ("deadline" in item) setters.setDeadline(item.deadline ? new Date(item.deadline) : new Date())
    } else {
        setters.setName(item.name)
        setters.setStarts(new Date(item.starts))
        setters.setDuration(item.duration)
        setters.setOccurs(("repeat" in item && item.repeat) ? "repeating" : "once")
        if ("repeat" in item && item.repeat) {
            setters.setFrequency(item.repeat.frequency)
            setters.setInterval(item.repeat.interval)
            if ("repeat" in item && "ordinal" in item.repeat) setters.setOrdinal(item.repeat.ordinal)
            if ("repeat" in item && "weekday" in item.repeat) setters.setWeekday(item.repeat.weekday)
            if ("repeat" in item && "weekdays" in item.repeat) setters.setWeekdays(item.repeat.weekdays)
            if ("repeat" in item && item.repeat.frequency === "monthly") setters.setMonthlyType(item.repeat.type)
            if ("repeat" in item && "days" in item.repeat) setters.setDays(item.repeat.days)
            if ("repeat" in item && "months" in item.repeat) setters.setMonths(item.repeat.months)
            if ("repeat" in item && "day" in item.repeat) setters.setDay(item.repeat.day)
            if ("repeat" in item && item.repeat.frequency === "yearly") setters.setYearlyType(item.repeat.type)
            if (item.notes) setters.setNotes(item.notes)
        }
    }
}