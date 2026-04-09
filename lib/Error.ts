import Email from "@/lib/Email"

const Error = {
    notify: async (err: unknown) => {
        await Email.send({
            from: {
                name: "Portfolio: Error Handler",
                email: process.env.GOOGLE_EMAIL ?? ""
            },
            to: {
                email: process.env.GOOGLE_EMAIL ?? ""
            },
            subject: "Internal Server Error Occured",
            message: JSON.stringify(err, Object.getOwnPropertyNames(err), "\t"),
        })
    }
}

export default Error