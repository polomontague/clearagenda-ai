import Item, { Step } from "@/types/Item"

export type AgendaItem = Omit<Item, "steps"> & {
    step: Step
}

type Agenda = {
    items: AgendaItem[]
}

export default Agenda