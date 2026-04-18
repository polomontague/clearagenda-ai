import SimpleUser from "@/types/SimpleUser"

type Model = "gpt-5.4-nano"

type Generation = {
    id: number,
    user: SimpleUser,
    model: Model,
    tokens: {
        input: number,
        output: number
    },
    cost: number
    created: string
}

export default Generation