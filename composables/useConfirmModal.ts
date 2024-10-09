export const useConfirmModal = () => {
  const isOpen = useState(() => false)
  const onConfirm = useState<null | (() => void)>(() => null)

  const handleConfirm = (callback: () => void) => {
    onConfirm.value = callback
    isOpen.value = true
  }

  const confirmAction = () => {
    if (onConfirm.value) {
      onConfirm.value()
    }
    isOpen.value = false
  }

  const cancelAction = () => {
    isOpen.value = false
    onConfirm.value = null
  }

  return {
    isOpen,
    handleConfirm,
    confirmAction,
    cancelAction,
  }
}
