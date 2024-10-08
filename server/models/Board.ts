import type { ListDocument } from './List'
import { type Document, model, Schema } from 'mongoose'

export interface BoardDocument extends Document<Schema.Types.ObjectId> {
  name: string
  lists: Schema.Types.ObjectId[] | ListDocument[]
  owner: string
  coverImage: string
}

const boardSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Untitled Board',
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export const Board = model<BoardDocument>('Board', boardSchema)
