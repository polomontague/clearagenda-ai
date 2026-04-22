import simpleUsersBaseQuery from "@/dao/UsersDAO/simpleUsersBaseQuery"

const itemsBaseQuery = {
    select: {
        id: true,
        user: simpleUsersBaseQuery,
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
        deadline: true,
        importance: true,
        notes: true,
        starts: true,
        ends: true,
        repeat: true,
        created: true,
        updated: true
    }
}

export default itemsBaseQuery