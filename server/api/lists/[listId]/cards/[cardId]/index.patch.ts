import CardSchema from '~/schemas/Card.schema'
import { Card } from '~/server/models/Card'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const body = await readValidatedBody(event, body => CardSchema.partial().parse(body))
  const cardId = getRouterParam(event, 'cardId')
  const updatedCard = await Card.findOneAndUpdate(
    {
      _id: cardId,
      owner: user._id,
    },
    body,
    { new: true },
  )

  if (!updatedCard) {
    throw createError({
      statusCode: 404,
      message: 'Card not found',
    })
  }

  return updatedCard
})
