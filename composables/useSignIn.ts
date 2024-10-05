import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import SignInSchema from '~/schemas/SignIn.schema'

export const useSignIn = () => {
  const formState = reactive({
    email: undefined,
    password: undefined,
  })

  const validationSchema = SignInSchema
  const isLoading = ref(false)

  const toast = useCustomToast()
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (
    event: FormSubmitEvent<z.output<typeof validationSchema>>,
  ) => {
    try {
      isLoading.value = true

      const { error } = await signIn('credentials', {
        redirect: false,
        email: event.data.email,
        password: event.data.password,
      })

      if (error) {
        throw new Error(error)
      }

      await router.push('/')
    }
    catch {
      toast.error({
        title: 'Invalid credentials',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    formState,
    isLoading,
    validationSchema,
    handleSubmit,
  }
}
