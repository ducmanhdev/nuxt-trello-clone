export const useSubscription = () => {
  const toast = useCustomToast()

  const isLoading = ref(false)

  const handleSubscribe = async () => {
    try {
      isLoading.value = true
      const data = await $fetch(`/api/users/subscribe`, {
        method: 'POST',
      })

      if (data) {
        window.location.href = data
      }
    }
    catch (e: any) {
      toast.error({
        title: 'Error',
        description: e.message || 'Something went wrong',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  const handleAccessPortal = async () => {
    try {
      isLoading.value = true
      const data = await $fetch(`/api/users/access-portal`)

      if (data) {
        window.location.href = data
      }
    }
    catch (e: any) {
      toast.error({
        title: 'Error',
        description: e.message || 'Something went wrong',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    handleSubscribe,
    handleAccessPortal,
  }
}
