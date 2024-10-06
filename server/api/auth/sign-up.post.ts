import SignUpSchema from '~/schemas/SignUp.schema'
import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, body => SignUpSchema.parse(body))

  const existingUser = await User.exists({ email: data.email })
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already exists',
    })
  }

  const user = await User.create(data)

  return {
    ...user.toJSON(),
    password: undefined,
  }
})
