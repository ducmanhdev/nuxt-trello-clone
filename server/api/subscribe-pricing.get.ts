import stripe from '~/utils/stripe'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await stripe().prices.retrieve(config.public.priceId)
  return data
})
