import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import axios from "axios"
import breakdown from "@/prompts/breakdown"
import Request from "@/lib/Request"
import z from "zod"

type Step = {
    name: string,
    duration: number
}

const bodySchema = z.object({
    message: z.string("message must be a string").min(1, "message must be 1 or more characters")
})

export const POST = async (req: NextRequest) => {
    try {
        const body = await Request.body(req, bodySchema)
        
        const res = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-5.4-nano",
            messages: [
                {
                    role: "system",
                    content: breakdown
                },
                {
                    role: "user",
                    content: body.message
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`
            }
        })
        const steps = JSON.parse(res.data.choices[0].message.content) as Step[]

        return Response.ok({ steps })
    } catch (err) {
        return Response.internalServerError()
    }
}