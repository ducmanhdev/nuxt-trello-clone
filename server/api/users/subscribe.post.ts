import { User } from '~/server/models/User'
import stripe from '~/utils/stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const user = await User.findById(event.context.user._id)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  if (!user.stripeCustomerId) {
    const customer = await stripe().customers.create({
      email: user.email,
      name: user.name,
    })

    user.stripeCustomerId = customer.id

    await user.save()
  }

  const session = await stripe().checkout.sessions.create({
    customer: user.stripeCustomerId,
    line_items: [
      {
        price: config.public.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${config.authOrigin}`,
    cancel_url: `${config.authOrigin}`,
  })

  if (!session || !session.url) {
    throw createError({
      statusCode: 500,
      message: 'Unable to create checkout session',
    })
  }

  return session.url
})
