// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    authOrigin: process.env.AUTH_ORIGIN,
    authSecret: process.env.AUTH_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      pixabayApiKey: process.env.PIXABAY_API_KEY,
      priceId: process.env.STRIPE_PRICE_ID,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@sidebase/nuxt-auth',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    provider: 'google',
  },
  colorMode: {
    preference: 'light',
  },
  auth: {
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: true,
    },
    globalAppMiddleware: true,
  },
})
