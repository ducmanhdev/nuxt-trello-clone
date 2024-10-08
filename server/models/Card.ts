import { type Document, model, Schema } from 'mongoose'

export interface CardDocument extends Document<Schema.Types.ObjectId> {
  name: string
  owner: string
  list: string
}

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Title is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: 'List',
      required: [true, 'List is required'],
    },
  },
  {
    timestamps: true,
  },
)

export const Card = model<CardDocument>('Card', cardSchema)
