import ListSchema from '~/schemas/List.Schema'
import { List } from '~/server/models/List'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const listId = getRouterParam(event, 'listId')
  const body = await readValidatedBody(event, body => ListSchema.partial().parse(body))

  const updatedLists = await List.findOneAndUpdate(
    { _id: listId, owner: user._id },
    {
      $set: body,
    },
    {
      new: true,
    },
  )

  if (!updatedLists) {
    throw createError({
      statusCode: 404,
      message: 'List not found',
    })
  }

  return updatedLists
})
