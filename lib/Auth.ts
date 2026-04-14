import { NextRequest } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import UsersDAO from "@/dao/UsersDAO"
import Validation from "@/lib/Validation"
import bcrypt from "bcrypt"
import User from "@/types/User"
import HttpError from "./HttpError"
import Response from "./Response"
import JWT from "@/constants/JWT"

const Auth = {
    signToken: (user: User, expires: number) => {
        const token = jwt.sign({
            id: user.id
        },
        process.env.JWT_SECRET ?? "",
        {
            expiresIn: expires
        })
        return token
    },
    hashPassword: async (password: string) => {
        return await bcrypt.hash(password, 10)
    },
    comparePasswords: async (options: {
        raw: string,
        hashed: string
    }) => {
        return await bcrypt.compare(options.raw, options.hashed)
    },
    authenticate: async (req: NextRequest): Promise<User> => {
        try {
            const authorization = req.headers.get("Authorization") ?? ""
            const [ key, token ] = authorization.split(/\s+/)
            if (!key || !token || key !== "Bearer") {
                throw new Error("Missing Bearer")
            }
            const decode = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload
            const user = await UsersDAO.getUserById(decode.id)
            if (!user) throw new HttpError(Response.unauthorized())
            return user
        } catch (err) {
            throw new HttpError(Response.unauthorized())
        }
    },
    authorize: (user: User | null) => {
        if (!user) throw new HttpError(Response.unauthorized())
    }
}

export default Auth