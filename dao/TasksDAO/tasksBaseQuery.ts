import simpleUsersBaseQuery from "../UsersDAO/simpleUsersBaseQuery"

const tasksBaseQuery = {
    select: {
        id: true,
        occurs: true,
        user: simpleUsersBaseQuery,
        name: true,
        description: true,
        steps: {
            select: {
                id: true,
                name: true,
                notes: true,
                duration: true,
                completed: true,
                completions: {
                    select: {
                        date: true,
                        completed: true
                    }
                }
            }
        },
        importance: true,
        once_deadline: true,
        repeating_deadline: true,
        repeat: true,
        created: true,
        updated: true
    }
}

export default tasksBaseQuery