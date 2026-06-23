import { systemMessage } from "./systemMessage"
import { userMessage } from "./userMessage"
import { sendRequest } from "../sendRequest"
import z from "zod"
import { Clarity, Friction, Specification } from "@/types/Task"

const outputSchema = z.object({
    name: z.string().trim().min(1),
    steps: z.array(z.object({
        name: z.string().trim().min(1),
        notes: z.string().trim().min(1).optional(),
        duration: z.number().min(1)
    })),
    importance: z.number().min(0).max(1)
})

export const plan = async ({ description, clarity, friction, specifications, userId }: {
    description: string,
    clarity: Clarity,
    friction: Friction[],
    specifications: Specification[],
    userId: number
}) => {
    const MODEL = "gpt-5.4-nano"
    const data = await sendRequest({
        model: MODEL,
        messages: {
            system: systemMessage,
            user: userMessage({
                description,
                clarity,
                friction,
                specifications
            })
        },
        userId,
        schema: outputSchema
    })
    return data
}