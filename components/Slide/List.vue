<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import { FETCH_LIST_KEY } from '~/constant'
import ListSchema from '~/schemas/List.schema'

const cardProps = useCardProps()
const toast = useCustomToast()

const isOpen = ref(false)

const listId = ref<string>()

const formSchema = ListSchema.omit({
  cards: true,
})

type SchemaInfer = z.infer<typeof formSchema>
const INITIAL_FORM_STATE: SchemaInfer = {
  name: '',
  board: '',
}
const formState = ref<SchemaInfer>({ ...INITIAL_FORM_STATE })
const formRef = ref<Form<SchemaInfer>>()

const isSubmitLoading = ref(false)
const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof formSchema>>,
) => {
  try {
    isSubmitLoading.value = true
    if (listId.value) {
      await $fetch(`/api/lists/${listId.value}`, {
        method: 'PATCH',
        body: event.data,
      })
    }
    else {
      await $fetch('/api/lists', {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success({
      title: `List was ${listId.value ? 'updated' : 'created'} successful`,
    })
    isOpen.value = false
    refreshNuxtData(FETCH_LIST_KEY)
  }
  catch (error: any) {
    if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map((err: any) => ({
        message: err.message,
        path: err.path[0],
      })))
    }
    toast.error({
      title: `Error ${listId.value ? 'updating' : 'creating'} list`,
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
    await $fetch(`/api/lists/${listId.value}`, {
      method: 'DELETE',
    })
    toast.success({
      title: 'List was delete successful',
    })
    isOpen.value = false
    refreshNuxtData(FETCH_LIST_KEY)
  }
  catch (error: any) {
    toast.error({
      title: 'Error deleting list',
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isDeleteLoading.value = false
  }
}

export type InitialValue = Partial<SchemaInfer & {
  _id: string
}> & {
  board: string
}

const show = (initialValue: InitialValue) => {
  listId.value = initialValue?._id ?? undefined
  formState.value.name = initialValue?.name ?? INITIAL_FORM_STATE.name
  formState.value.board = initialValue.board
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
        {{ listId ? 'Update list' : 'Create list' }}
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
            v-if="listId"
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
