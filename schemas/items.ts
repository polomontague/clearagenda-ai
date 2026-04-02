import z from "zod"

export const itemParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater")
})