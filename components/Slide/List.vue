<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Schema } from 'mongoose'
import type { z } from 'zod'
import ListSchema from '~/schemas/List.schema'

export type InitialValue = z.infer<typeof ListSchema> & {
  _id: Schema.Types.ObjectId
}

const cardProps = useCardProps()
const toast = useCustomToast()

const currentListId = ref<Schema.Types.ObjectId>(undefined)
const slideOverTitle = computed(() => {
  return currentListId.value ? 'Update list' : 'Create list'
})

const INITIAL_FORM_STATE = {
  name: undefined,
  board: undefined,
}
const formState = ref({ ...INITIAL_FORM_STATE })

const FORM_REF_NAME = 'LIST_FORM'
const formRef = useTemplateRef(FORM_REF_NAME)
const formSchema = ListSchema
const isCreateBoardOpen = ref(false)

const isSubmitLoading = ref(false)
const handleSubmit = async (
  event: FormSubmitEvent<z.output<typeof formSchema>>,
) => {
  const isUpdate = currentListId.value
  try {
    isSubmitLoading.value = true
    if (isUpdate) {
      await $fetch(`/api/lists/${currentListId.value}`, {
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
      title: `List was ${isUpdate ? 'updated' : 'created'} successful`,
    })
    isCreateBoardOpen.value = false
    useEvent('refresh-lists')
  }
  catch (error) {
    if (error.statusMessage === 'Validation Error' && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map(err => ({
        message: err.message,
        path: err.path[0],
      })))
    }
    toast.error({
      title: `Error ${isUpdate ? 'updating' : 'creating'} list`,
      description: error.data?.message || 'An unknown error occurred',
    })
  }
  finally {
    isSubmitLoading.value = false
  }
}

const isCanDelete = computed(() => currentListId.value)
const isDeleteLoading = ref(false)
const handleDelete = async () => {
  if (!currentListId.value)
    return
  try {
    isDeleteLoading.value = true
    await $fetch(`/api/lists/${currentListId.value}`, {
      method: 'DELETE',
    })
    toast.success({
      title: 'List was delete successful',
    })
    isCreateBoardOpen.value = false
    useEvent('refresh-lists')
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

const show = (initialValue?: InitialValue) => {
  if (initialValue) {
    currentListId.value = initialValue._id
    formState.value.name = initialValue.name
    formState.value.board = initialValue.board
  }
  else {
    currentListId.value = undefined
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
        <UFormGroup label="List name" name="name">
          <UInput v-model="formState.name" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            v-if="isCanDelete"
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
