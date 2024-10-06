import type { Form, FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import SignupSchema from '~/schemas/SignUp.schema'

export const useSignUp = () => {
  const router = useRouter()
  const toast = useCustomToast()

  const formRef = ref<Form>()
  const handleSetFormRef = el => formRef.value = el

  const formState = ref({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  })
  const formSchema = SignupSchema
  const isSubmitLoading = ref(false)
  const handleSubmit = async (
    event: FormSubmitEvent<z.output<typeof SignupSchema>>,
  ) => {
    try {
      isSubmitLoading.value = true
      await $fetch('/api/auth/sign-up', {
        method: 'POST',
        body: event.data,
      })
      toast.success({
        title: 'Sign up was successful',
        description: 'Your account has been created successfully, Redirecting you to the sign in page',
      })
      await router.push('/auth/sign-in')
    }
    catch (error) {
      if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
        return formRef.value?.setErrors(error.data.data.issues.map(err => ({
          message: err.message,
          path: err.path[0],
        })))
      }
      toast.error({
        title: 'Error creating account',
        description: error.data?.message || 'An unknown error occurred',
      })
    }
    finally {
      isSubmitLoading.value = false
    }
  }

  return {
    handleSetFormRef,
    formState,
    formSchema,
    isSubmitLoading,
    handleSubmit,
  }
}
