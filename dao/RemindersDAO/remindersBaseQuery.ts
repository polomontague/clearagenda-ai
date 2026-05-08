import simpleUsersBaseQuery from "../UsersDAO/simpleUsersBaseQuery"

const remindersBaseQuery = {
    select: {
        id: true,
        occurs: true,
        user: simpleUsersBaseQuery,
        name: true,
        once_at: true,
        repeating_at: true,
        repeat: true,
        created: true,
        updated: true
    }
}

export default remindersBaseQuery