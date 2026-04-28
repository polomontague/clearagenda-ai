import axios, { AxiosError } from "axios"
import Cookies from "universal-cookie"
import { ErrorResponseBody } from "@/lib/Response"

const cookies = new Cookies()

type Method = "post" | "get" | "put" | "delete"
type Body = Record<string, any>

type SendRequestOptions = {
    method: Method,
    endpoint: string,
    body?: Body,
    authorize?: boolean
}

const sendRequest = async <Data>({ method, endpoint, body, authorize }: SendRequestOptions): Promise<Data> => {
    try {
        const query = new URLSearchParams(window.location.search)
        if (authorize && !cookies.get("token") || authorize && !query.get("token")) {
            // TODO: implement token refresh
        }
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`
        const config = {
            headers: {
                Authorization: authorize && cookies.get("token") ? `Bearer ${cookies.get("token")}`
                    : authorize && query.get("token") ? `Bearer ${query.get("token")}` : undefined
            }
        }
        const res = method === "post" || method === "put" ? await axios[method](url, body, config)
            : await axios[method](url, config)
        return res.data.data
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            if (axios.isAxiosError<ErrorResponseBody>(err)) {
                throw err.response?.data.error
            }
        }
        throw err
    }
}

const API = {
    post: async <Data>(endpoint: string, body: Body, authorize?: boolean): Promise<Data> => {
        return sendRequest({
            method: "post",
            endpoint,
            body,
            authorize
        })
    },
    get: async <Data>(endpoint: string, authorize?: boolean): Promise<Data> => {
        return sendRequest({
            method: "get",
            endpoint,
            authorize
        })
    },
    put: async <Data>(endpoint: string, body: Body, authorize?: boolean): Promise<Data> => {
        return sendRequest({
            method: "put",
            endpoint,
            body,
            authorize
        })
    },
    delete: async <Data>(endpoint: string, authorize?: boolean): Promise<Data> => {
        return sendRequest({
            method: "delete",
            endpoint,
            authorize
        })
    }
}

export default API