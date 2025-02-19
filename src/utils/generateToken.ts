import { User } from "../models/user.model"
import { ApiError } from "./ApiError"
const generateToken = async (userId: string): Promise<{ accessToken: string, refreshToken: string } | null> => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, "Invalid User Id")
        }
        const accessToken:string = await user.generateAccessToken()
        const refreshToken:string = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        console.log(error)
        return null;
    }

}

export default generateToken