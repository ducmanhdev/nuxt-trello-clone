import BoardSchema from '~/schemas/Board.schema'
import { Board } from '~/server/models/Board'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const boardId = getRouterParam(event, 'boardId')
  const data = await readValidatedBody(event, body => BoardSchema.pick({
    lists: true,
  }).parse(body))
  return Board.updateOne(
    { _id: boardId, owner: user._id },
    {
      $set: data,
    },
  )
})
