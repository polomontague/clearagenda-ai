import User from "@/types/User"

export default function getWeekdayCapacity(user: User, date: Date): number {
    const weekday = date.getDay()
    const weekdays = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ] as const
    return user.preferences.hours[weekdays[weekday]] * 60
}