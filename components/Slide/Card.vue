<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import CardSchema from '~/schemas/Card.schema'

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const cardProps = useCardProps()
const toast = useCustomToast()

const isOpen = ref(false)

const listId = ref<string>()
const cardId = ref<string>()

const formSchema = CardSchema.omit({
  list: true,
})
type SchemaInfer = z.infer<typeof formSchema>
const INITIAL_FORM_STATE: SchemaInfer = {
  name: '',
}
const formState = ref<SchemaInfer>({ ...INITIAL_FORM_STATE })
const formRef = ref<Form<SchemaInfer>>()

const isSubmitLoading = ref(false)
const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof formSchema>>,
) => {
  try {
    isSubmitLoading.value = true
    if (cardId.value) {
      await $fetch(`/api/lists/${listId.value}/cards/${cardId.value}`, {
        method: 'PATCH',
        body: event.data,
      })
    }
    else {
      await $fetch(`/api/lists/${listId.value}/cards`, {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success({
      title: `Card was ${cardId.value ? 'updated' : 'created'} successful`,
    })
    isOpen.value = false
    emit('refresh')
  }
  catch (error: any) {
    if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map((err: any) => ({
        message: err.message,
        path: err.path[0],
      })))
    }
    toast.error({
      title: `Error ${cardId.value ? 'updating' : 'creating'} card`,
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isSubmitLoading.value = false
  }
}

const isDeleteLoading = ref(false)
const handleDelete = async () => {
  try {
    isDeleteLoading.value = true
    await $fetch(`/api/lists/${listId.value}/cards/${cardId.value}`, {
      method: 'DELETE',
    })
    toast.success({
      title: 'Card was delete successful',
    })
    isOpen.value = false
    emit('refresh')
  }
  catch (error: any) {
    toast.error({
      title: 'Error deleting card',
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isDeleteLoading.value = false
  }
}

export type InitialValue = Partial<SchemaInfer> & {
  listId: string
  _id?: string
}
const show = (initialValue: InitialValue) => {
  listId.value = initialValue.listId
  cardId.value = initialValue?._id ?? undefined
  formState.value.name = initialValue?.name ?? INITIAL_FORM_STATE.name
  isOpen.value = true
}

defineExpose({
  show,
})
</script>

<template>
  <USlideover v-model="isOpen">
    <UCard v-bind="cardProps">
      <template #header>
        {{ cardId ? 'Update card' : 'Create card' }}
      </template>
      <UForm
        ref="formRef"
        :schema="formSchema"
        :state="formState"
        class="space-y-4"
        :validate-on="['submit']"
        @submit="handleSubmit"
      >
        <UFormGroup label="Name" name="name">
          <UInput v-model="formState.name" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            v-if="cardId"
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
