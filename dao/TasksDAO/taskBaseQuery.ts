import simpleUsersBaseQuery from "@/dao/UsersDAO/simpleUsersBaseQuery"

const taskBaseQuery = {
    select: {
        id: true,
        user: simpleUsersBaseQuery,
        name: true,
        notes: true,
        description: true,
        duration: true,
        steps: {
            select: {
                id: true,
                name: true,
                notes: true,
                duration: true,
                completed: true
            }
        },
        deadline: true,
        importance: true,
        created: true,
        updated: true,
        completed: true
    }
}

export default taskBaseQuery