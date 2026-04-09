import SimpleUser from "@/types/SimpleUser"

export type SimpleTask = {
    type: "simple",
    id: number,
    user: SimpleUser,
    name: string,
    notes?: string,
    duration: number,
    deadline?: string,
    urgency: number,
    importance: number,
    priority: number,
    created: string,
    updated: string,
    completed?: string
}

export type ComplexTaskStep = {
    id: number,
    name: string,
    notes: string,
    duration: number,
    completed?: string
}

export type ComplexTask = {
    type: "complex",
    id: number,
    user: SimpleUser,
    name: string,
    description: string,
    steps: ComplexTaskStep[],
    deadline?: string,
    urgency: number,
    importance: number,
    priority: number,
    created: string,
    updated: string
}

type Task = SimpleTask | ComplexTask

export default Task