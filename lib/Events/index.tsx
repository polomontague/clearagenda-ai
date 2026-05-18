import Event, { OnceEvent } from "@/types/Event"
import Utility from "../Utility"
import { DateTime } from "luxon"
import getDateEvents from "./getDateEvents"
import getFrom from "./getFrom"
import getEnded from "./getEnded"
import getStatus from "./getStatus"

const Events = {
    getFrom,
    getEnded,
    getStatus,
    getDateEvents
}

export default Events