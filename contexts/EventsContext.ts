import { createContext } from "react"
import Event from "@/types/Event"

const EventsContext = createContext<{
    events: Event[],
    addEvent: (event: Event) => void,
    replaceEvent: (event: Event) => void,
    removeEvent: (event: Event) => void,
    loading: boolean
}>({
    events: [],
    addEvent: () => {},
    replaceEvent: () => {},
    removeEvent: () => {},
    loading: true
})

export default EventsContext