export const useSubscription = () => {
  const toast = useCustomToast()

  const pricing = useState(() => 0)
  const { data, error } = useFetch('/api/subscribe-pricing')

  watch(data, () => {
    pricing.value = centsToDollars(data.value?.unit_amount || 0)
  })

  if (error.value) {
    toast.error({
      title: 'Error',
      description: 'Failed to fetch pricing',
    })
  }

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
        window.open(data, '_blank')
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
    isLoading: readonly(isLoading),
    pricing: readonly(pricing),
    handleSubscribe,
    handleAccessPortal,
  }
}
