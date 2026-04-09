import prisma from "@/lib/prisma"
import usersBaseQuery from "./usersBaseQuery"
import assembleUser from "./assembleUser"
import User from "@/types/User"

type GetUsersOptions = {
    email?: string,
    phone?: string
}

type NameData = User["name"]

type EmailData = User["email"]

type PhoneData = User["phone"]

type PasswordData = string

type ThemeData = User["preferences"]["theme"]

type AccentData = User["preferences"]["accent"]

type PreferencesHoursData = User["preferences"]["hours"]

const UsersDAO = {
    getUsers: async (options: GetUsersOptions) => {
        const result = await prisma.users.findMany({
            where: {
                email: options.email,
                phone: options.phone
            },
            ...usersBaseQuery
        })
        return result.map(result => assembleUser(result))
    },
    getUserById: async (userId: number) => {
        const result = await prisma.users.findUnique({
            where: {
                id: userId
            },
            ...usersBaseQuery
        })
        if (result) return assembleUser(result)
    },
    getPasswordByUserId: async (userId: number) => {
        const result = await prisma.users.findUnique({
            where: {
                id: userId
            },
            select: {
                password: true
            }
        })
        if (result) return result.password
    },
    deleteUser: async (userId: number) => {
        const result = await prisma.users.delete({
            where: {
                id: userId
            },
            ...usersBaseQuery
        })
        return assembleUser(result)
    },

    updateName: async (userId: number, data: NameData) => {
        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                first_name: data.first,
                last_name: data.last
            },
            select: {
                first_name: true,
                last_name: true
            }
        })
        return {
            first: result.first_name,
            last: result.last_name
        }
    },
    updateEmail: async (userId: number, data: EmailData) => {
        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                email: data
            },
            select: {
                email: true
            }
        })
        return result.email
    },
    updatePhone: async (userId: number, data: PhoneData) => {
        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                phone: data
            },
            select: {
                phone: true
            }
        })
        return result.phone
    },
    updatePassword: async (userId: number, data: PasswordData) => {
        await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                password: data
            }
        })
    },
    updateTheme: async (userId: number, data: ThemeData) => {
        await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                theme: data
            }
        })
        return data
    },
    updateAccent: async (userId: number, data: AccentData) => {
        await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                accent: data
            }
        })
        return data
    },
    updatePreferencesHours: async (userId: number, data: PreferencesHoursData) => {
        const result = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                sunday_hours: data.sunday,
                monday_hours: data.monday,
                tuesday_hours: data.tuesday,
                wednesday_hours: data.wednesday,
                thursday_hours: data.thursday,
                friday_hours: data.friday,
                saturday_hours: data.saturday
            }
        })
        return data
    }
}

export default UsersDAO