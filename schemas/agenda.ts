import z from "zod"
import Validation from "@/lib/Validation"

export const agendaQuerySchema = z.object({
    start: z.string("start must be a string").trim().refine(value => Validation.dateTime(value), "start must be ISO 8601 datetime format")
})