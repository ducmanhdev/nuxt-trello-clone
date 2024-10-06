import { z } from 'zod'
import SignInSchema from './SignIn.Schema'

export default SignInSchema.extend({
  name: z
    .string({
      required_error: 'Please enter your name',
      invalid_type_error: 'Please enter a valid name',
    }),
  confirmPassword: SignInSchema.shape.password,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
