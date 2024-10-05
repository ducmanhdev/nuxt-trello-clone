import { Board } from '~/server/models/Board'
import type { UserDocument } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserDocument

  return Board.find({ owner: user._id }).sort({ createdAt: -1 })
})
