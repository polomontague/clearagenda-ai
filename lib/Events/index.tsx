import Event, { OnceEvent } from "@/types/Event"
import Utility from "../Utility"
import { DateTime } from "luxon"
import getDateEvents from "./getDateEvents"
import getFrom from "./getFrom"
import getEnded from "./getEnded"
import getStatus from "./getStatus"
import { getTotalDuration } from "./getTotalDuration"
import { getNextEvent } from "./getNextEvent"

const Events = {
    getFrom,
    getEnded,
    getStatus,
    getDateEvents,
    getTotalDuration,
    getNextEvent
}

export default Events