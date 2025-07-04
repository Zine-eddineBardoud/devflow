import { Document, model, models, Schema } from "mongoose";

export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String },
        image: { type: String },
        location: { types: String },
        portfolio: { types: String },
        reputation: { types: Number },
    },
    { timestamps: true }
);

const User = models?.user || model<IUser>("User", UserSchema);

export default User;
