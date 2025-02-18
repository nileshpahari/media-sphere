import { DB_NAME } from "../constants";
import mongoose from "mongoose";
const dbConnect = async ():Promise<void> => {
    try {
        const dbInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("\nConnected to MongoDB", dbInstance.connection.host)
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

export { dbConnect }