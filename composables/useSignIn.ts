import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import SignInSchema from '~/schemas/SignIn.schema'

export const useSignIn = () => {
  const formState = ref({
    email: undefined,
    password: undefined,
  })
  const formSchema = SignInSchema
  const isSubmitLoading = ref(false)

  const toast = useCustomToast()
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (
    event: FormSubmitEvent<z.output<typeof formSchema>>,
  ) => {
    try {
      isSubmitLoading.value = true

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
      isSubmitLoading.value = false
    }
  }

  return {
    formState,
    isSubmitLoading,
    formSchema,
    handleSubmit,
  }
}
