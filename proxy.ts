import { NextResponse, NextRequest } from "next/server"
import Response from "@/lib/Response"

export const proxy = (req: NextRequest): Response => {
    if (req.method === "OPTIONS") {
        return Response.ok()
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/api/:path*", // all API routes
}