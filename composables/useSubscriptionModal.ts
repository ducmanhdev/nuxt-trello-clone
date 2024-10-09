export const useSubscriptionModal = () => {
  const { handleSubscribe } = useSubscription()

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
    isOpen,
    handleShow,
    isActionLoading: readonly(isActionLoading),
    confirmAction,
    cancelAction,
  }
}
