import Accent from "@/types/Accent"
import Theme from "@/types/Theme"

type User = {
    id: number,
    name: {
        first: string,
        last: string
    },
    email: string,
    phone: string,
    preferences: {
        theme: Theme,
        accent: Accent
        hours: {
            sunday: number,
            monday: number,
            tuesday: number,
            wednesday: number,
            thursday: number,
            friday: number,
            saturday: number
        }
    },
    created: string,
    updated: string
}

export default User