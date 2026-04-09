import Email from "@/lib/Email"
import Emails from "@/constants/Emails"

const Error = {
    notify: async (err: unknown) => {
        // console.log in dev, send email in production
        const enviroment = process.env.NODE_ENV
        if (enviroment === "development") {
            console.log("ERROR: ", err)
        }
        try {
            // Catch errors sending thr email to prevent cascading errors
            if (enviroment === "production") {
                await Email.send({
                    from: {
                        name: "Error Handler",
                        email: Emails.NO_REPLY
                    },
                    to: {
                        name: "Dev Team",
                        email: Emails.ERRORS
                    },
                    subject: "Internal Server Error Occured",
                    message: JSON.stringify(err, Object.getOwnPropertyNames(err), "\t"),
                })
            }
        } catch (err) {
            console.log("ERROR: ", err)
        }
    }
}

export default Error