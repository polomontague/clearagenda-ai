import { OnceEvent } from "@/types/Event"

export default function getEnded(event: OnceEvent): boolean {
    const ends = new Date(event.starts)
    ends.setMinutes(ends.getMinutes() + event.duration)
    return ends.getTime() >= new Date().getTime()
}