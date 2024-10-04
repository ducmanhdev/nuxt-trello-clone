import {type Document, Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;

    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exists"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await generateHash(this.password);

    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const User = model<UserDocument>("User", userSchema);