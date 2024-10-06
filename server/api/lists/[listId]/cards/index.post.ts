import CardSchema from '~/schemas/Card.schema'
import { Card } from '~/server/models/Card'
import { List } from '~/server/models/List'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const body = await readValidatedBody(event, body => CardSchema.omit({
    list: true,
  }).parse(body))
  const listId = getRouterParam(event, 'listId')
  const card = await Card.create({
    ...body,
    list: listId,
    owner: user._id,
  })

  await List.findByIdAndUpdate(listId, {
    $push: { cards: { $each: [card._id], $position: 0 } },
  })

  event.node.res.statusCode = 201

  return card
})
