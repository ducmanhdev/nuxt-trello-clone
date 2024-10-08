import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '~/server/models/User'

async function getUser(id: string) {
  const user = await User.findById(id)
  return user?.toJSON()
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  pages: {
    signIn: '/auth/sign-in',
  },
  providers: [
    (CredentialsProvider as any).default({
      name: 'credentials',
      async authorize(credential: { email: string, password: string }) {
        const user = await User.findOne({ email: credential.email })

        if (!user) {
          return null
        }

        const isValid = await user.comparePassword(credential.password)

        if (!isValid) {
          return null
        }

        return user.toJSON()
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user,
        }
      }

      return token
    },

    async session({ session, token }) {
      const refreshedUser = await getUser(token._id as string)

      session.user = {
        ...token,
        ...session.user,
        ...refreshedUser,
      }

      return session
    },
  },
})
