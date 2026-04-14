import Item, { Step } from "@/types/Item"

type AgendaItem = Omit<Item, "steps"> & {
    step: Step
}

type Agenda = {
    items: AgendaItem[]
}

export default Agenda