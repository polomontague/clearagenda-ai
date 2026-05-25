import { NextResponse, NextRequest } from "next/server"
import Response from "@/lib/Response"

export const middleware = (req: NextRequest): Response => {
    if (req.method === "OPTIONS") {
        return Response.ok()
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/api/:path*", // all API routes
}