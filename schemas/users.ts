import Validation from "@/lib/Validation"
import z from "zod"

export const userParamsSchems = z.object({
    user_id: z.coerce.number("user_id must be a number").min(1, "user_id must be 1 or greater")
})

export const nameBodySchema = z.object({
    first: z.string("first must be a string").trim().min(1, "first must be 1 or more characters"),
    last: z.string("last must be a string").trim().min(1, "last must be 1 or more characters")
})

export const emailBodySchema = z.object({
    email: z.string("email must be a string").trim().refine(value => Validation.email(value), "email must be a valid email")
})

export const phoneBodySchema = z.object({
    phone: z.string("phone must be a string").trim().refine(value => Validation.phone(value), "phone must be a valid phone number")
})

export const passwordBodySchema = z.object({
    current_password: z.string("current_password must be a string").trim().refine(value => Validation.password(value), "current_password must be a valid password"),
    new_password: z.string("new_password must be a string").trim().refine(value => Validation.password(value), "new_password must be a valid password")
})

export const themeBodySchema = z.object({
    theme: z.literal([ "light", "dark", "system" ], 'theme must be "light", "dark", or "system"')
})

export const accentBodySchema = z.object({
    accent: z.literal([ "red", "orange", "coral", "yellow", "lime", "green", "mint", "turquoise", "sky", "lavender", "pink" ], 'accent must be "red", "orange", "coral", "yellow", "lime", "green", "mint", "turquoise", "sky", "lavender", or "pink"')
})

export const hoursBodySchema = z.object({
    sunday: z.int("sunday must be an integer").min(0, "sunday must be 0 or greater").max(24, "sunday must not be greater than 24"),
    monday: z.int("monday must be an integer").min(0, "monday must be 0 or greater").max(24, "monday must not be greater than 24"),
    tuesday: z.int("tuesday must be an integer").min(0, "tuesday must be 0 or greater").max(24, "tuesday must not be greater than 24"),
    wednesday: z.int("wednesday must be an integer").min(0, "wednesday must be 0 or greater").max(24, "wednesday must not be greater than 24"),
    thursday: z.int("thursday must be an integer").min(0, "thursday must be 0 or greater").max(24, "thursday must not be greater than 24"),
    friday: z.int("friday must be an integer").min(0, "friday must be 0 or greater").max(24, "friday must not be greater than 24"),
    saturday: z.int("saturday must be an integer").min(0, "saturday must be 0 or greater").max(24, "saturday must not be greater than 24")
})