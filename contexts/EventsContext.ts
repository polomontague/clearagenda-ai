import { createContext } from "react"
import Event from "@/types/Event"

const EventsContext = createContext<{
    events: Event[],
    addEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    removeEvent: (event: Event) => void
}>({
    events: [],
    addEvent: () => {},
    updateEvent: () => {},
    removeEvent: () => {}
})

export default EventsContext