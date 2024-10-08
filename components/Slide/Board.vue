<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import { FETCH_BOARD_KEY } from '~/constant'
import BoardSchema from '~/schemas/Board.schema'

const cardProps = useCardProps()
const toast = useCustomToast()

const isCreateBoardOpen = ref(false)

const boardId = ref<string>()
type SchemaInfer = z.infer<typeof BoardSchema>
const INITIAL_FORM_STATE: SchemaInfer = {
  name: '',
  coverImage: '',
}
const formState = ref<SchemaInfer>({ ...INITIAL_FORM_STATE })
const formSchema = BoardSchema
const formRef = ref<Form<SchemaInfer>>()

const isSubmitLoading = ref(false)
const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof formSchema>>,
) => {
  try {
    isSubmitLoading.value = true
    if (boardId.value) {
      await $fetch(`/api/boards/${boardId.value}`, {
        method: 'PATCH',
        body: event.data,
      })
    }
    else {
      await $fetch('/api/boards', {
        method: 'POST',
        body: event.data,
      })
    }
    toast.success({
      title: `Board was ${boardId.value ? 'updated' : 'created'} successful`,
    })
    isCreateBoardOpen.value = false
    refreshNuxtData(FETCH_BOARD_KEY)
  }
  catch (error: any) {
    if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map((err: any) => ({
        message: err.message,
        path: err.path[0],
      })))
    }
    toast.error({
      title: `Error ${boardId.value ? 'updating' : 'creating'} board`,
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
    await $fetch(`/api/boards/${boardId.value}`, {
      method: 'DELETE',
    })
    toast.success({
      title: 'Board was delete successful',
    })
    isCreateBoardOpen.value = false
    refreshNuxtData(FETCH_BOARD_KEY)
  }
  catch (error: any) {
    toast.error({
      title: 'Error deleting board',
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isDeleteLoading.value = false
  }
}

export type initialValue = SchemaInfer & {
  _id: string
}
const show = (initialValue?: initialValue) => {
  if (initialValue) {
    boardId.value = initialValue._id
    formState.value.name = initialValue.name
    formState.value.coverImage = initialValue.coverImage
  }
  else {
    boardId.value = undefined
    formState.value = { ...INITIAL_FORM_STATE }
  }
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
        {{ boardId ? 'Update board' : 'Create board' }}
      </template>
      <UForm
        ref="formRef"
        :schema="formSchema"
        :state="formState"
        class="space-y-4"
        :validate-on="['submit']"
        @submit="handleSubmit"
      >
        <UFormGroup label="Board name" name="name">
          <UInput v-model="formState.name" />
        </UFormGroup>
        <UFormGroup label="Cover image" name="coverImage">
          <ImagePicker v-model="formState.coverImage" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            v-if="boardId"
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

<style scoped>

</style>
