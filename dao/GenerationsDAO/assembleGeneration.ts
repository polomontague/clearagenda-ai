import assembleSimpleUser from "@/dao/UsersDAO/assembleSimpleUser"
import { Prisma } from "@/lib/prisma"
import generationsBaseQuery from "./generationsBaseQuery"
import Generation from "@/types/Generation"

type GenerationResult = Prisma.generationsGetPayload<typeof generationsBaseQuery>

type CostMap = {
    [K in Generation["model"]]: {
        input: number,
        output: number
    }
}

const assembleGeneration = (result: GenerationResult): Generation => {
    const model = result.model as Generation["model"]
    const tokens = {
        input: result.input_tokens,
        output: result.output_tokens
    }
    return {
        id: result.id,
        user: assembleSimpleUser(result.user),
        model,
        tokens,
        cost: calculateCost(model, tokens),
        created: result.created.toISOString()
    }
}

const calculateCost = (model: Generation["model"], tokens: Generation["tokens"]) => {
    // costs are per million tokens from the Open AI pricing page
    const costMap: CostMap = {
        "gpt-5.4-nano": {
            input: 0.20 / 1000000,
            output: 1.25 / 1000000
        }
    }
    return (tokens.input * costMap[model].input) + (tokens.output * costMap[model].output)
}

export default assembleGeneration