import { SimpleTask, ComplexTask, ComplexTaskStep } from "@/types/Task"

type StepTask = Omit<ComplexTask, "steps"> & {
    step: ComplexTaskStep
}

type TaskAgendaItem = {
    type: "task",
    task: SimpleTask | StepTask
}

type EventAgendaItem = {
    type: "event"
}

export type AgendaItem = TaskAgendaItem | EventAgendaItem

type Agenda = {
    items: AgendaItem[]
}

export default Agenda