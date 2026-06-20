import openai from "@/lib/openai"
import { planSystemMessage, planUserMessage } from "./messages/plan"
import GenerationsDAO from "@/dao/GenerationsDAO"

const AI = {
    plan: async (userId: number, description: string, experience: 0 | 1 | 2): Promise<{
        name: string,
        importance: number,
        steps: {
            name: string,
            notes: string,
            duration: number
        }[]
    }> => {
        const model = "gpt-5.4-nano"
        const res = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: planSystemMessage
                },
                {
                    role: "user",
                    content: planUserMessage(description, experience)
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
        return output
    }
}

export default AI