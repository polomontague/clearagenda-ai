import { NextResponse } from "next/server"

type SuccessOptions = {
    type: "success",
    data?: Record<string, any>,
    status: number
}

type ErrorOptions = {
    type: "error",
    code: string,
    message: string,
    fields?: Record<string, string>,
    status: number
}

type ResponseOptions = SuccessOptions | ErrorOptions

const response = (options: ResponseOptions): NextResponse => {
    return NextResponse.json({
        success: options.type === "success" ? true : false,
        data: "data" in options ? options.data : undefined,
        error: options.type === "error" ? {
            code: options.code,
            message: options.message,
            fields: options.fields
        } : undefined,
        status: options.status
    }, {
        status: options.status,
        headers: {
            "Access-Control-Allow-Origin": process.env.BASE_URL ?? "*",
            "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        }
    })
}

const Response = {
    ok: (data?: Record<string, any>) => {
        return response({
            type: "success",
            data,
            status: 200
        })
    },
    created: (data: Record<string, any>) => {
        return response({
            type: "success",
            data,
            status: 201
        })
    },
    invalidBody: () => {
        return response({
            type: "error",
            code: "INVALID_REQUEST_BODY",
            message: "Invalid Request Body",
            status: 400
        })
    },
    unauthorized: (message: string = "Unauthorized") => {
        return response({
            type: "error",
            code: "UNAUTHORIZED",
            message,
            status: 401
        })
    },
    incorrectCredentials: () => {
        return response({
            type: "error",
            code: "INCORRECT_CREDENTIALS",
            message: "Incorrect Credentials",
            status: 401
        })
    },
    forbidden: () => {
        return response({
            type: "error",
            code: "FORBIDDEN",
            message: "Forbidden",
            status: 403
        })
    },
    notFound: (message: string = "Resource Not Found") => {
        return response({
            type: "error",
            code: "NOT_FOUND",
            message,
            status: 404
        })
    },
    childNotFound: (message: string = "Child Resource Not Found") => {
        return response({
            type: "error",
            code: "CHILD_NOT_FOUND",
            message,
            status: 404
        })
    },
    usernameTaken: () => {
        return response({
            type: "error",
            code: "USERNAME_TAKEN",
            message: "Username is Taken",
            status: 409
        })
    },
    emailTaken: () => {
        return response({
            type: "error",
            code: "EMAIL_TAKEN",
            message: "Email Taken",
            status: 409
        })
    },
    phoneTaken: () => {
        return response({
            type: "error",
            code: "PHONE_TAKEN",
            message: "Phone Taken",
            status: 409
        })
    },
    hasChildren: () => {
        return response({
            type: "error",
            code: "RESOURCE_HAS_CHILDREN",
            message: "Resource Has Children",
            status: 409
        })
    },
    validationError: (fields: Record<string, string>) => {
        return response({
            type: "error",
            code: "VALIDATION_ERROR",
            message: "Request Data Failed Validation",
            fields,
            status: 422
        })
    },
    internalServerError: () => {
        return response({
            type: "error",
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal Server Error",
            status: 500
        })
    }
}

export default Response