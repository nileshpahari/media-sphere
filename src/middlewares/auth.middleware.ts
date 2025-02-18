import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Request, Response, NextFunction } from "express";

interface DecodedAccessToken {
  _id: string;
}
const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Barier ", "");
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as DecodedAccessToken;

    const user = await User.findById(decodedAccessToken?._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  },
);

export { verifyJWT };

/*import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError"; // Removed .js, TypeScript doesn't require extensions for internal imports
import { asyncHandler } from "../utils/asyncHandler"; // Removed .js
import { User } from "../models/user.model"; // Removed .js

// Define the structure of the decoded JWT payload to get proper type safety
interface DecodedAccessToken {
  _id: string;
}

const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Decode the token with a proper type for the decoded object
    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as DecodedAccessToken;

    const user = await User.findById(decodedAccessToken._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
});

export { verifyJWT };
*/
