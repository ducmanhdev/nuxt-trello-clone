import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  try {
    const config = useRuntimeConfig()
    await mongoose.connect(config.mongodbUri)
    console.log('Mongodb connected')
  }
  catch (error: any) {
    console.log('Mongodb connect error', error.message)
  }
})
