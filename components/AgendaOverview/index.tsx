import styles from "./AgendaOverview.module.css"
import Fieldset from "../Fieldset"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import { TaskOccurrence } from "@/types/Task"
import { EventOccurrence } from "@/types/Event"
import Reminder from "@/types/Reminder"
import Utility from "@/lib/Utility"
import Tasks from "@/lib/Tasks"
import Events from "@/lib/Events"
import { useMemo } from "react"
import Reminders from "@/lib/Reminders"
import Placeholder from "../Placeholder"
import { MagnifyingGlassIcon } from "../Icons"

type AgendaOverviewProps = {
    tasks: TaskOccurrence[],
    events: EventOccurrence[],
    reminders: Reminder[]
    day: Date
}

export default function AgendaOverview({ tasks, events, reminders, day }: AgendaOverviewProps) {
    const nextEvent = useMemo(() => Events.getNextEvent(events), [events])
    const nextReminder = useMemo(() => Reminders.getNextReminder(reminders), [reminders])

    return (
        <div className={styles.background}>
            <div className={styles.frame}>
                <div className={styles.column}>
                    <h1 className={styles.date}>{Utility.formatDate(day, true)}</h1>
                    <Fieldset>
                        <LabelField fieldset label="Tasks">
                            <InnerValue label={Utility.formatDuration(Tasks.getTotalDuration(tasks))} />
                        </LabelField>
                        <LabelField fieldset label="Events">
                            <InnerValue label={Utility.formatDuration(Events.getTotalDuration(events))} />
                        </LabelField>
                        <LabelField fieldset label="Reminders">
                            <InnerValue label={Utility.formatCount(reminders.length)} />
                        </LabelField>
                    </Fieldset>
                </div>
                <div className={styles.column}>
                    <div className={styles.innerFrame}>
                        <div className={`${styles.row} ${styles.rowFirst}`}>
                            {nextEvent ? (
                                <Fieldset label="Next Event">
                                    <LabelField fieldset label={nextEvent.event.name}>
                                        <InnerValue label={Utility.formatTime(nextEvent.starts)} />
                                    </LabelField>
                                </Fieldset>
                            ) : (
                                <Placeholder layer={2} icon={<MagnifyingGlassIcon />} label="No Upcoming Events" />
                            )}
                        </div>
                        <div className={`${styles.row} ${styles.rowLast}`}>
                            {nextReminder ? (
                                <Fieldset label="Next Reminder">
                                    <LabelField fieldset label={nextReminder.name}>
                                        <InnerValue label={Reminders.getAt(nextReminder).time} />
                                    </LabelField>
                                </Fieldset>
                            ) : (
                                <Placeholder layer={2} icon={<MagnifyingGlassIcon />} label="No Upcoming Reminders" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}