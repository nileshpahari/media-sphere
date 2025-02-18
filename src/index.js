import dotenv from "dotenv"
import { dbConnect } from "./db/index.js"
import app from "./app.js"

dotenv.config()

dbConnect()
    .then(() => {
        app.on("error", (error) => {
            console.log("Failed to listen ", error);
            throw error;
        })
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Started listening at PORT: ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Database failed to connect", error)
    })
