import { Board } from '~/server/models/Board'
import { List } from '~/server/models/List'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const boardId = getRouterParam(event, 'boardId')

  return Board.findOne({ _id: boardId, owner: user._id }).populate(
    {
      path: 'lists',
      model: List,
    },
  )
})
