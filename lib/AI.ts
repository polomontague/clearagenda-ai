import axios from "axios"
import breakdown from "@/prompts/breakdown"
import { ComplexTaskStep } from "@/types/Task"

const AI = {
    breakdownTask: async (description: string) => {
        const res = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-5.4-nano",
            messages: [
                {
                    role: "system",
                    content: breakdown
                },
                {
                    role: "user",
                    content: description
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`
            }
        })
        const steps = JSON.parse(res.data.choices[0].message.content) as Omit<ComplexTaskStep, "id">[]
        return steps
    },
    estimateTaskDuration: async (name: string, notes?: string) => {
        const res = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-5.4-nano",
            messages: [
                {
                    role: "system",
                    content: `You are a task time estimation assistant.

Estimate how long a task will take to complete.

Rules:
- Return a single integer number only.
- The number represents minutes.
- Do not include any text, explanation, or formatting.
- Do not include units (no "minutes").
- Base the estimate on a typical individual with average skill and focus.
- If the task includes notes, use them to improve accuracy.
- If uncertain, provide a reasonable best estimate.

Output example:
25`
                },
                {
                    role: "user",
                    content: `Task: ${name}
${notes ? `Notes: ${notes}` : ""}`
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`
            }
        })
        const duration = parseInt(res.data.choices[0].message.content)
        return duration
    }
}

export default AI