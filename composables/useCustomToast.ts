export const useCustomToast = () => {
  const toast = useToast()

    type Options = Parameters<typeof toast.add>[0]

    const success = (options: Options) => {
      toast.add({
        color: 'green',
        icon: 'ion:checkmark',
        ...options,
      })
    }

    const error = (options: Options) => {
      toast.add({
        color: 'red',
        icon: 'ion:close-circle-outline',
        ...options,
      })
    }

    return {
      ...toast,
      success,
      error,
    }
}
