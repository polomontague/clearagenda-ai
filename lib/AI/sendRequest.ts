import openai from "@/lib/openai"
import GenerationsDAO from "@/dao/GenerationsDAO"
import { Model } from "@/types/Generation"
import z from "zod"

export const sendRequest = async <T extends z.ZodTypeAny>({ model, messages, userId, schema }: {
    model: Model,
    messages: {
        system: string,
        user: string
    },
    userId: number,
    schema: T
}): Promise<z.infer<T>> => {
    const res = await openai.chat.completions.create({
        model,
        messages: [
            {
                role: "system",
                content: messages.system
            },
            {
                role: "user",
                content: messages.user
            }
        ]
    })
    const output = JSON.parse(res.choices[0].message.content ?? "{}")
    await GenerationsDAO.createGeneration({
        user_id: userId,
        model,
        tokens: {
            input: res.usage?.prompt_tokens ?? 0,
            output: res.usage?.completion_tokens ?? 0
        }
    })
    return schema.parse(output)
}