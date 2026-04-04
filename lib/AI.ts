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
    }
}

export default AI