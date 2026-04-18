import prisma from "@/lib/prisma"
import Generation from "@/types/Generation"
import assembleGeneration from "./assembleGeneration"
import generationsBaseQuery from "./generationsBaseQuery"
import User from "@/types/User"

type GenerationData = Pick<Generation, "model" | "tokens"> & {
    user_id: Generation["user"]["id"]
}

type GetGenerationsOptions = {
    user_id?: User["id"]
}

const GenerationsDAO = {
    createGeneration: async (data: GenerationData) => {
        const result = await prisma.generations.create({
            data: {
                user_id: data.user_id,
                model: data.model,
                input_tokens: data.tokens.input,
                output_tokens: data.tokens.output
            },
            ...generationsBaseQuery
        })
        return assembleGeneration(result)
    },
    getGenerations: async (options: GetGenerationsOptions) => {
        const result = await prisma.generations.findMany({
            where: {
                user_id: options.user_id
            },
            ...generationsBaseQuery
        })
        return result.map(result => assembleGeneration(result))
    }
}

export default GenerationsDAO