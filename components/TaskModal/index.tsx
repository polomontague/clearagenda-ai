"use client"
import { useMemo, useContext } from "react"
import Task from "@/types/Task"
import Modal from "../Modal"
import FieldFrame from "../FieldFrame"
import LabelField from "../LabelField"
import Fieldset from "../Fieldset"
import ValueBox from "../ValueBox"
import SlideField from "../SlideField"
import InnerValue from "../InnerValue"
import Range from "../Range"
import Utility from "@/lib/Utility"
import Tasks from "@/lib/Tasks"
import UserContext from "@/contexts/UserContext"

type TaskModalProps = {
    task: Task,
    open: boolean,
    onRequestClose: () => void
}

export default function TaskModal({ task, open, onRequestClose }: TaskModalProps) {
    const { user } = useContext(UserContext)
    if (!user) return
    const completion = useMemo(() => task.occurs === "once" ? Tasks.getCompletion(task) : undefined, [task])
    const status = useMemo(() => Tasks.getStatus(task, user), [task, user])

    return (
        <Modal label={task.name} open={open} onRequestClose={onRequestClose}>
            <FieldFrame>
                <LabelField label="Status">
                    <InnerValue  color={status.color} label={status.label} />
                </LabelField>
                <SlideField label="Steps" value={task.steps.length.toString()}>
                    {task.steps.map((step, i) => {
                        return (
                            <Fieldset key={i} label={step.name}>
                                {step.notes ? (
                                    <ValueBox fieldset value={step.notes} />
                                ) : null}
                                <LabelField fieldset label="Length">
                                    <InnerValue label={Utility.formatDuration(step.duration)} />
                                </LabelField>
                            </Fieldset>
                        )
                    })}
                </SlideField>
                <Fieldset
                    description={task.occurs === "repeating" ? Utility.getRepeatLabel(task.repeat) : undefined}
                >
                    <LabelField fieldset label="Length">
                        <InnerValue label={Tasks.getLength(task)} />
                    </LabelField>
                    {task.deadline ? (
                        <LabelField fieldset label="Deadline">
                            <InnerValue label={Tasks.getDeadline(task)} />
                        </LabelField>
                    ) : null}
                </Fieldset>
                {completion !== undefined ? (
                    <Fieldset>
                        <LabelField fieldset label="Completion">
                            <InnerValue label={`${completion * 100}%`} />
                        </LabelField>
                        <Range fieldset value={completion} />
                    </Fieldset>
                ) : <></>}
            </FieldFrame>
        </Modal>
    )
}