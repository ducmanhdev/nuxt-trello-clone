import { z } from 'zod'

export default z.object({
  email: z.string({
    required_error: 'Please enter your email address',
  }).email('Please enter a valid email'),
  password: z.string({
    required_error: 'Please enter your password',
  }).min(8, 'Must be at least 8 characters'),
})
