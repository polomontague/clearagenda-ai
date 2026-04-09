import axios from "axios"
import breakdown from "@/prompts/breakdown"
import { ComplexTaskStep } from "@/types/Task"
import openai from "@/lib/openai"

const AI = {
    breakdownTask: async (description: string) => {
        const data = await openai.chat.completions.create({
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
        })
        const steps = JSON.parse(data.choices[0].message.content ?? "") as Omit<ComplexTaskStep, "id">[]
        return steps
    },
    estimateTaskDuration: async (name: string, notes?: string) => {
        const data = await openai.chat.completions.create({
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
        })
        return parseInt(data.choices[0].message.content ?? "")
    },
    estimateTaskImportance: async (options: {
        name: string,
        notes?: string,
        description?: string
    }) => {
        const data = await openai.chat.completions.create({
            model: "gpt-5.4-nano",
            messages: [
                {
                    role: "system",
                    content: "You are a task prioritization expert. Your goal is to read a task and its optional notes, and estimate its importance relative to other tasks. Importance is a number between 0 and 1, where 0 = not important at all, and 1 = extremely important. Base your estimation on urgency, impact, and significance of the task. Output only a single number between 0 and 1 with up to 2 decimal places."
                },
                {
                    role: "user",
                    content: `Task: ${options.name}
${options.notes ? `Notes: ${options.notes}` : ""}
${options.description ? `Description: ${options.description}` : ""}`.trim()
                }
            ]
        })
        return parseFloat(data.choices[0].message.content ?? "")
    }
}

export default AI