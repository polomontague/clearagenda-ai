"use client"
import { useMemo } from "react"
import Task from "@/types/Task"
import Modal from "../Modal"
import FieldFrame from "../FieldFrame"
import LabelField from "../LabelField"
import Fieldset from "../Fieldset"
import ValueBox from "../ValueBox"
import SlideField from "../SlideField"
import Tasks from "@/lib/Tasks"
import InnerValue from "../InnerValue"
import Range from "../Range"
import Utility from "@/lib/Utility"

type TaskModalProps = {
    task: Task,
    open: boolean,
    onRequestClose: () => void
}

export default function TaskModal({ task, open, onRequestClose }: TaskModalProps) {
    const completion = useMemo(() => task.occurs === "once" ? Tasks.getCompletion(task) : undefined, [task])
    
    return (
        <Modal label={task.name} open={open} onRequestClose={onRequestClose}>
            <FieldFrame>
                <SlideField label="Steps" value={task.steps.length.toString()}>
                    {task.steps.map((step, i) => {
                        return (
                            <Fieldset label={step.name}>
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