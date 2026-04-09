import z from "zod"
import Validation from "@/lib/Validation"

export const agendaQuerySchema = z.object({
    date: z.string("date must be a string").trim().refine(value => Validation.date(value), "date must be ISO 8601 date format").optional()
})