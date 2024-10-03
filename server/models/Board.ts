import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface BoardDocument extends Document {
    name: string;
    owner: string;
    coverImage: string;
}

const boardSchema = new Schema(
    {
        name: {
            type: String,
            default: "Untitled Board",
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        coverImage: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Board = model<BoardDocument>("Board", boardSchema);