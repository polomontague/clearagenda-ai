import { NextRequest } from "next/server"
import z, { ZodError } from "zod"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"

const Request = {
    params: async <T extends z.ZodTypeAny>(props: {
        params: Promise<Record<string, string>>
    }, schema: T): Promise<z.infer<T>> => {
        try {
            return schema.parse(await props.params)
        } catch (err) {
            if (err instanceof ZodError) {
                const fields = formatZodError(err as ZodError)
                throw new HttpError(Response.validationError(fields))
            }
            throw err
        }
    },
    body: async <T extends z.ZodTypeAny>(req: NextRequest, schema: T): Promise<z.infer<T>> => {
        let body
        try {
            const contentType = req.headers.get("content-type") ?? ""
            const type = contentType.startsWith("multipart/form-data") ? "formdata" : "json"
            if (type === "json") {
                body = await req.json()
            } else {
                body =  formDataToJSON(await req.formData())
            }
        } catch (err) {
            throw new HttpError(Response.invalidBody())
        }
        try {
            return await schema.parseAsync(body)
        } catch(err) {
            if (err instanceof ZodError) {
                const fields = formatZodError(err as ZodError)
                throw new HttpError(Response.validationError(fields))
            }
            throw err
        }
    },
    query: <T extends z.ZodTypeAny>(req: NextRequest, schema: T): z.infer<T> => {
        try {
            const query: Record<string, string> = {}
            req.nextUrl.searchParams.forEach((value, key) => {
                query[key] = value
            })
            return schema.parse(query)
        } catch (err) {
            if (err instanceof ZodError) {
                const fields = formatZodError(err as ZodError)
                throw new HttpError(Response.validationError(fields))
            }
            throw err
        }
    }
}

const formDataToJSON = (formData: FormData) => {
    const json: Record<string, any> = {}
    formData.forEach((value, key) => {
        const path = key.split(/\[|\]/).filter(Boolean).map(segment => !isNaN(parseInt(segment)) ? parseInt(segment) : segment)
        let current = json
        path.forEach((part, i) => {
            const isLast = i === path.length - 1
            const next = path[i + 1]
            // If last, assign the value
            if (isLast) {
                let newValue
                if (value === "null") {
                    newValue = null
                } else if (value === "true") {
                    newValue = true
                } else if (value === "false") {
                    newValue = false
                } else if (!isNaN(parseInt(typeof value === "string" ? value : ""))) {
                    newValue = Number(value)
                } else {
                    newValue = value
                }
                current[part] = newValue
            } else {
                // Determine if next should be an array or object
                if (current[part] === undefined) {
                    // Normalize - if next is a number: array, otherwise its a string: property
                    current[part] = typeof next === "number" ? [] : {}
                }
                current = current[part]
            }
        })
    })
    return json
}

const formatZodError = (error: ZodError) => {
    const fields: Record<string, string> = {}
    error.issues.forEach(issue => {
        const key = issue.path.join(".") // handles nested fields
        // only assign first error per field
        if (!fields[key]) {
            fields[key] = issue.message
        }
    })
    return fields
}

export default Request