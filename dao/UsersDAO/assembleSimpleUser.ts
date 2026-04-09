import SimpleUser from "@/types/SimpleUser"
import { Prisma } from "@/lib/prisma"
import simpleUsersBaseQuery from "./simpleUsersBaseQuery"

type SimpleUserResult = Prisma.usersGetPayload<typeof simpleUsersBaseQuery>

const assembleSimpleUser = (result: SimpleUserResult): SimpleUser => {
    return {
        id: result.id,
        name: {
            first: result.first_name,
            last: result.last_name
        }
    }
}

export default assembleSimpleUser