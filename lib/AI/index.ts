import openai from "@/lib/openai"
import { planSystemMessage, planUserMessage } from "./messages/plan"

const AI = {
    plan: async (description: string) => {
        const res = await openai.chat.completions.create({
            model: "gpt-5.4-nano",
            messages: [
                {
                    role: "system",
                    content: planSystemMessage
                },
                {
                    role: "user",
                    content: planUserMessage(description)
                }
            ]
        })
        return JSON.parse(res.choices[0].message.content ?? "{}") as {
            name: string,
            importance: number,
            steps: {
                name: string,
                notes: string,
                duration: number
            }[]
        }
    }
}

export default AI