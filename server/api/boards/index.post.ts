import BoardSchema from '~/schemas/Board.schema'
import { Board } from '~/server/models/Board'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument
  const body = await readValidatedBody(event, body => BoardSchema.parse(body))

  const boardCount = await Board.countDocuments({ owner: user._id })

  if (boardCount >= 1 && !user.hasActiveSubscription) {
    throw createError({
      statusCode: 403,
      message:
        'You can\'t create more than 1 boards in free plan. Please upgrade your plan to create unlimited',
    })
  }

  return await Board.create({
    ...body,
    owner: user._id,
  })
})
