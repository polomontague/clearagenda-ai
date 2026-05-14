"use client"
import List, { ListItem } from "@/components/List"
import Event, { OnceEvent } from "@/types/Event"
import Card from "@/components/Card"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import { useContext } from "react"
import UserContext from "@/contexts/UserContext"
import User from "@/types/User"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"

type EventListProps = {
    events: Event[]
}

export default function EventList(props: EventListProps) {
    const { user } = useContext(UserContext)

    const getFrom = (event: Event): string => {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts)
            ends.setMinutes(ends.getMinutes() + event.duration)
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else { // Repeating
            return ""
        }
    }

    const getStatus = (event: Event, user: User): {
        code: "upcoming" | "repeating" | "ended",
        color: string,
        label: string
    } => {
        const accent = user.preferences.accent
        const COLORS = {
            sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
            gray: "var(--layer-4-light)"
        }
        if (event.occurs === "once") {
            const ended = getEnded(event)
            if (ended) return { code: "ended", color: COLORS.gray, label: "Ended" }
            return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
        } else { // Repeating event
            return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
        }
    }

    const getEnded = (event: OnceEvent) => {
        const ends = new Date(event.starts)
        ends.setMinutes(ends.getMinutes() + event.duration)
        return ends.getTime() >= new Date().getTime()
    }

    if (!user) return

    return (
        <List>
            {props.events.map((event, i) => {
                const status = getStatus(event, user)
                return (
                    <ListItem key={i}>
                        <Card
                            label={event.name}
                            buttons={[
                                {
                                    icon: <EditIcon />,
                                    onClick: () => {}
                                },
                                {
                                    icon: <TrashCanIcon />,
                                    onClick: () => {}
                                }
                            ]}
                        >
                            <FieldFrame>
                                <LabelField label="From">
                                    <InnerValue label={getFrom(event)} />
                                </LabelField>
                                <LabelField label="Status">
                                    <InnerValue
                                        color={status.color}
                                        label={status.label}
                                    />
                                </LabelField>
                            </FieldFrame>
                        </Card>
                    </ListItem>
                )
            })}
        </List>
    )
}