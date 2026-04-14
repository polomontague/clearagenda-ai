import SimpleUser from "@/types/SimpleUser"

type Item = {
    id: number,
    user: SimpleUser,
    name: string,
    description: string,
    steps: Step[],
    deadline?: string,
    urgency: number,
    importance: number,
    priority: number,
    created: string,
    updated: string
}

export type Step = {
    id: number,
    name: string,
    notes: string,
    duration: number,
    completed?: string
}

export default Item