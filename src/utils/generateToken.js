import { User } from "../models/user.models.js"
import { ApiError } from "./ApiError.js"
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, "Invalid User Id")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    
    } catch (error) {
        console.log(error)
    }

}

export default generateToken