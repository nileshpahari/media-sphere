import mongoose, {Schema, Document, Model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    watchHistory: mongoose.Types.ObjectId[],
    username: string,
    email: string,
    fullName: string,
    avatar: string,
    coverImage?: string,
    password: string,
    refreshToken?: string,
    isPassCorrect(password: string): Promise<boolean>,
    generateAccessToken(): string,
    generateRefreshToken(): string
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required"],

    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.isPassCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string| number,
    })
}
userSchema.methods.generateRefreshToken = function ():string {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET as string {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string | number,
    })
}

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);