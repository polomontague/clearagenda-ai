import z from "zod"
import Validation from "@/lib/Validation"

export const loginBodySchema = z.object({
    username: z.string("username must be a string").trim().refine(value => Validation.email(value) || Validation.phone(value), "username must be a valid email or phone number"),
    password: z.string("password must be a string").trim().refine(value => Validation.password(value), "password must be a valid password")
})