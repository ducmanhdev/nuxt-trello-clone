export const useSubscriptionModal = () => {
  const { handleSubscribe } = useSubscription()

  const price = useState(() => 5)
  const isOpen = useState(() => false)
  const isActionLoading = useState(() => false)

  const handleShow = () => {
    isOpen.value = true
  }
  const confirmAction = async () => {
    isActionLoading.value = true
    try {
      await handleSubscribe()
    }
    finally {
      isActionLoading.value = false
      isOpen.value = false
    }
  }

  const cancelAction = () => {
    isOpen.value = false
  }
  return {
    price: readonly(price),
    isOpen,
    handleShow,
    isActionLoading: readonly(isActionLoading),
    confirmAction,
    cancelAction,
  }
}
