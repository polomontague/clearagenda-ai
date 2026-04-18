import SimpleUser from "@/types/SimpleUser"

type Item = {
    id: number,
    user: SimpleUser,
    name: string,
    description: string, // The description for the AI prompt
    steps: Step[],
    deadline?: string, // ISO 8601 datetime
    urgency: number, // 0.00-1.00
    importance: number, // 0.00-1.00
    priority: number, // 0.00-1.00
    created: string, // ISO 8601 datetime
    updated: string // ISO 8601 datetime
}

export type Step = {
    id: number,
    name: string,
    notes: string,
    duration: number, // minutes
    completed?: string // ISO 8601 datetime
}

export default Item