import { NextResponse } from "next/server"

export default class HttpError extends Error {
    response: NextResponse

    constructor(response: NextResponse) {
        super()
        this.response = response
    }
}