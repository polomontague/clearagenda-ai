export type SimpleTask = {
    type: "simple",
    id: number,
    name: string,
    notes?: string,
    created: string,
    updated: string
}

export type ComplexTaskStep = {
    id: number,
    name: string,
    notes: string,
    duration: number
}

export type ComplexTask = {
    type: "complex",
    id: number,
    name: string,
    description: string,
    steps: ComplexTaskStep[],
    created: string,
    updated: string
}

type Task = SimpleTask | ComplexTask

export default Task