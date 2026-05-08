import simpleUsersBaseQuery from "@/dao/UsersDAO/simpleUsersBaseQuery"

const itemsBaseQuery = {
    select: {
        id: true,
        user: simpleUsersBaseQuery,
        type: true,
        name: true,
        description: true,
        steps: {
            select: {
                id: true,
                name: true,
                notes: true,
                duration: true,
                completed: true
            }
        },
        importance: true,
        notes: true,
        starts: true,
        duration: true,
        occurs: true,
        deadline: true,
        repeat: true,
        timezone: true,
        created: true,
        updated: true
    }
}

export default itemsBaseQuery