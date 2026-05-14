"use client"
import Task from "@/types/Task"
import Modal from "../Modal"
import FieldFrame from "../FieldFrame"
import LabelField from "../LabelField"
import Fieldset from "../Fieldset"
import ValueBox from "../ValueBox"
import SlideField from "../SlideField"

type TaskModalProps = {
    task: Task,
    open: boolean,
    onRequestClose: () => void
}

export default function TaskModal({ task, open, onRequestClose }: TaskModalProps) {
    return (
        <Modal label={task.name} open={open} onRequestClose={onRequestClose}>
            <FieldFrame>
                <SlideField label="Steps" value={task.steps.length.toString()}>
                    fd
                </SlideField>
            </FieldFrame>
        </Modal>
    )
}