import { NextResponse } from "next/server"

type SuccessStatus = 200 | 201
type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500

type SuccessOptions<Data extends Record<string, any>> = {
    type: "success",
    data?: Data,
    status: SuccessStatus
}

type ErrorOptions = {
    type: "error",
    code: string,
    message: string,
    fields?: Record<string, string>,
    status: ErrorStatus
}

type ResponseOptions<Data extends Record<string, any>> = SuccessOptions<Data> | ErrorOptions

type SuccessResponseBody<Data extends Record<string, any>> = {
    success: true,
    data?: Data,
    status: SuccessStatus
}

export type ErrorResponseBody = {
    success: false,
    error: {
        code: string,
        message: string,
        fields?: Record<string, string>
    },
    status: ErrorStatus
}

type ResponseBody<Data extends Record<string, any>> = SuccessResponseBody<Data> | ErrorResponseBody

const response = <Data extends Record<string, any>>(options: ResponseOptions<Data>): NextResponse<ResponseBody<Data>> => {
    const body: ResponseBody<Data> = options.type === "success" ? {
        success: true,
        data: options.data,
        status: options.status
    } : {
        success: false,
        error: {
            code: options.code,
            message: options.message,
            fields: options.fields
        },
        status: options.status
    }
    return NextResponse.json(body, {
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
    ok: <Data extends Record<string, any>>(data?: Data) => {
        return response({
            type: "success",
            data,
            status: 200
        })
    },
    created: <Data extends Record<string, any>>(data: Data) => {
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
    unauthorized: () => {
        return response({
            type: "error",
            code: "UNAUTHORIZED",
            message: "Unauthorized",
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
    notFound: () => {
        return response({
            type: "error",
            code: "NOT_FOUND",
            message: "Resource Not Found",
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
   taskHasSteps: () => {
    return response({
        type: "error",
        code: "TASK_HAS_STEPS",
        message: "Each Step Must be Completed Separately",
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