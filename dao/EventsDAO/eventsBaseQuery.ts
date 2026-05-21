import simpleUsersBaseQuery from "../UsersDAO/simpleUsersBaseQuery"

const eventsBaseQuery = {
    select: {
        id: true,
        occurs: true,
        user: simpleUsersBaseQuery,
        name: true,
        notes: true,
        duration: true,
        timezone: true,
        once_starts: true,
        repeating_starts: true,
        repeat: true,
        created: true,
        updated: true
    }
}

export default eventsBaseQuery