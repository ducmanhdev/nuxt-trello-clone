<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Schema } from 'mongoose'
import type { z } from 'zod'
import CardSchema from '~/schemas/Card.schema'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const formSchema = CardSchema.omit({
  list: true,
})

export type InitialValue = z.infer<typeof formSchema>
const cardProps = useCardProps()
const toast = useCustomToast()

const currentListId = ref<Schema.Types.ObjectId>(undefined)
const currentCardId = ref<Schema.Types.ObjectId>(undefined)
const slideOverTitle = computed(() => {
  return currentCardId.value ? 'Update card' : 'Create card'
})

const INITIAL_FORM_STATE: InitialValue = {
  name: undefined,
}
const formState = ref<InitialValue>({ ...INITIAL_FORM_STATE })

const FORM_REF_NAME = 'CARD_FORM'
const formRef = useTemplateRef(FORM_REF_NAME)
const isCreateBoardOpen = ref(false)

const isSubmitLoading = ref(false)
const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof formSchema>>,
) => {
  try {
    isSubmitLoading.value = true
    if (currentCardId.value) {
      await $fetch(`/api/lists/${currentListId.value}/cards/${currentCardId.value}`, {
        method: 'PATCH',
        body: event.data,
      })
    }
    else {
      await $fetch(`/api/lists/${currentListId.value}/cards`, {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success({
      title: `Card was ${currentCardId.value ? 'updated' : 'created'} successful`,
    })
    isCreateBoardOpen.value = false
    emit('refresh')
  }
  catch (error) {
    if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map(err => ({
        message: err.message,
        path: err.path[0],
      })))
    }
    toast.error({
      title: `Error ${isUpdate ? 'updating' : 'creating'} card`,
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isSubmitLoading.value = false
  }
}

const isDeleteLoading = ref(false)
const handleDelete = async () => {
  if (!currentListId.value)
    return
  try {
    isDeleteLoading.value = true
    await $fetch(`/api/lists/${currentListId.value}/cards/${currentCardId.value}`, {
      method: 'DELETE',
    })
    toast.success({
      title: 'Card was delete successful',
    })
    isCreateBoardOpen.value = false
    emit('refresh')
  }
  catch (error) {
    toast.error({
      title: 'Error deleting board',
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isDeleteLoading.value = false
  }
}

const show = (
  listId: typeof currentListId,
  cardId: typeof currentCardId,
  initialValue?: InitialValue,
) => {
  if (initialValue) {
    formState.value.name = initialValue.name
  }
  else {
    formState.value = { ...INITIAL_FORM_STATE }
  }
  currentListId.value = listId
  currentCardId.value = cardId
  isCreateBoardOpen.value = true
}

defineExpose({
  show,
})
</script>

<template>
  <USlideover v-model="isCreateBoardOpen">
    <UCard v-bind="cardProps">
      <template #header>
        {{ slideOverTitle }}
      </template>
      <UForm
        :ref="FORM_REF_NAME"
        :schema="formSchema"
        :state="formState"
        class="space-y-4"
        :validate-on="['submit']"
        @submit="handleSubmit"
      >
        <UFormGroup label="Card name" name="name">
          <UInput v-model="formState.name" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            v-if="currentCardId"
            type="button"
            color="red"
            block
            class="flex-1"
            :loading="isDeleteLoading"
            @click="handleDelete"
          >
            Delete
          </UButton>
          <UButton
            type="button"
            block
            class="flex-1"
            :loading="isSubmitLoading"
            @click="formRef?.submit()"
          >
            Submit
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>
