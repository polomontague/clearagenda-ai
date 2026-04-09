import User from "@/types/User"
import { Prisma } from "@/lib/prisma"
import usersBaseQuery from "./usersBaseQuery"

type UsersResult = Prisma.usersGetPayload<typeof usersBaseQuery>

const assembleUser = (result: UsersResult): User => {
    return {
        id: result.id,
        name: {
            first: result.first_name,
            last: result.last_name
        },
        email: result.email,
        phone: result.phone,
        preferences: {
            theme: result.theme,
            accent: result.accent,
            hours: {
                sunday: result.sunday_hours,
                monday: result.monday_hours,
                tuesday: result.tuesday_hours,
                wednesday: result.wednesday_hours,
                thursday: result.thursday_hours,
                friday: result.friday_hours,
                saturday: result.saturday_hours
            }
        },
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

export default assembleUser