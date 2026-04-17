import z from "zod"
import Validation from "@/lib/Validation"

export const registerBodySchema = z.object({
    name: z.object({
        first: z.string("first must be a string").trim().min(1, "first must be 1 or more characters"),
        last: z.string("last must be a string").trim().min(1, "last must be 1 or more characters")
    }, "name must be an object"),
    email: z.string("email must be a string").trim().refine(value => Validation.email(value), "email must be a valid email"),
    phone: z.string("phone must be a string").trim().refine(value => Validation.phone(value), "phone must be a valid phone number"),
    password: z.string("password must be a string").trim().refine(value => Validation.password(value), "password must be a valid password")
})

export const loginBodySchema = z.object({
    username: z.string("username must be a string").trim().refine(value => Validation.email(value) || Validation.phone(value), "username must be a valid email or phone number"),
    password: z.string("password must be a string").trim().refine(value => Validation.password(value), "password must be a valid password")
})

export const forgotPasswordSchema = z.object({
    email: z.string("email must be a string").trim().refine(value => Validation.email(value), "email must be a valid email address")
})