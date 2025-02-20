import mongoose, {Model, Document, Schema} from "mongoose";

export interface ISubscription extends Document {
    channel: Schema.Types.ObjectId,
    subscriber: Schema.Types.ObjectId  
} 


const subscriptionSchema: Schema<ISubscription> = new Schema<ISubscription>({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Subscription: Model<ISubscription> = mongoose.model<ISubscription>("Subscription", subscriptionSchema);