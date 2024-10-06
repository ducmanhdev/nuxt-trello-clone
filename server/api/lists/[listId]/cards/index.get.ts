import { List } from '~/server/models/List'

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, 'listId')

  const list = await List.findById(listId).populate('cards')

  if (!list) {
    throw createError({
      statusCode: 404,
      message: 'List not found',
    })
  }

  return list.cards
})
