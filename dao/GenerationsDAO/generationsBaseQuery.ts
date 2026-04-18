import simpleUsersBaseQuery from "@/dao/UsersDAO/simpleUsersBaseQuery"

const generationsBaseQuery = {
    select: {
        id: true,
        user: simpleUsersBaseQuery,
        model: true,
        input_tokens: true,
        output_tokens: true,
        created: true
    }
}

export default generationsBaseQuery