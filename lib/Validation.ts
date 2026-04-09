const Validation = {
    email: (value: string) => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regex.test(value)
    },
    phone: (value: string) => {
        const regex = /^\d+$/
        return regex.test(value) && value.length === 11
    },
    password: (value: string) => {
        // Check length
        if (value.length < 8) return false
        // Check for at least one capital letter
        if (!/[A-Z]/.test(value)) return false
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(value)) return false
        // Check for at least one number
        if (!/[0-9]/.test(value)) return false
        // All criteria met
        return true
    },
    date: (value: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        return regex.test(value)
    }
}

export default Validation