import { Board } from '~/server/models/Board'
import { Card } from '~/server/models/Card'
import { List } from '~/server/models/List'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const listId = getRouterParam(event, 'listId')

  const list = await List.findOneAndDelete({
    _id: listId,
    owner: user._id,
  })

  if (!list) {
    throw createError({
      statusCode: 404,
      message: 'List not found',
    })
  }

  await Board.findByIdAndUpdate(list.board, {
    $pull: { lists: list._id },
  })

  await Card.deleteMany({
    list: list._id,
  })

  event.node.res.statusCode = 204

  return true
})
