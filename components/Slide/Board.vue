<script setup lang="ts">
import {Schema} from "mongoose";
import BoardSchema from "~/schemas/Board.schema";
import type {FormSubmitEvent} from "#ui/types";
import {z} from "zod";

export type InitialValue = z.infer<typeof BoardSchema> & {
  _id: Schema.Types.ObjectId
}

const cardProps = useCardProps();
const toast = useCustomToast();

const slideOverTitle = computed(() => {
  return currentBoardId.value ? "Update board" : "Create board";
})

const currentBoardId = ref<Schema.Types.ObjectId>(undefined);

const INITIAL_FORM_STATE = {
  name: undefined,
  coverImage: undefined,
}
const formState = ref({...INITIAL_FORM_STATE});

const FORM_REF_NAME = "BOARD_FORM";
const formRef = useTemplateRef(FORM_REF_NAME);
const formSchema = BoardSchema;

const isSubmitLoading = ref(false);
const handleSubmit = async (
    event: FormSubmitEvent<z.output<typeof formSchema>>
) => {
  const isUpdate = currentBoardId.value;
  try {
    isSubmitLoading.value = true;
    if (isUpdate) {
      await $fetch(`/api/boards/${currentBoardId.value}`, {
        method: "PATCH",
        body: event.data,
      });
    } else {
      await $fetch("/api/boards", {
        method: "POST",
        body: event.data,
      });
    }
    toast.success({
      title: `Board was ${isUpdate ? "updated" : "created"} successful`,
    });
    isCreateBoardOpen.value = false;
    useEvent("refresh-boards");
  } catch (error) {
    if (error.statusMessage === "Validation Error" && error.data?.data?.issues) {
      return formRef.value?.setErrors(error.data.data.issues.map((err) => ({
        message: err.message,
        path: err.path[0],
      })));
    }
    toast.error({
      title: `Error ${isUpdate ? "updating" : "creating"} board`,
      description: error.data?.message || "An unknown error occurred",
    });
  } finally {
    isSubmitLoading.value = false;
  }
};

const isCanDelete = computed(() => currentBoardId.value);
const isDeleteLoading = ref(false);
const handleDelete = async () => {
  if (!currentBoardId.value) return;
  try {
    isDeleteLoading.value = true;
    await $fetch(`/api/boards/${currentBoardId.value}`, {
      method: "DELETE",
    });
    toast.success({
      title: "Board was delete successful",
    });
    isCreateBoardOpen.value = false;
    useEvent("refresh-boards");
  } catch (error) {
    toast.error({
      title: "Error deleting board",
      description: error.data?.message || "An unknown error occurred",
    });
  } finally {
    isDeleteLoading.value = false;
  }
};

const isCreateBoardOpen = ref(false);
const show = (initialValue?: InitialValue) => {
  if (initialValue) {
    currentBoardId.value = initialValue._id;
    formState.value.name = initialValue.name;
    formState.value.coverImage = initialValue.coverImage;
  } else {
    currentBoardId.value = undefined;
    formState.value = {...INITIAL_FORM_STATE};
  }
  isCreateBoardOpen.value = true;
}

defineExpose({
  show,
})
</script>

<template>
  <USlideover v-model="isCreateBoardOpen">
    <UCard v-bind="cardProps">
      <template #header>{{ slideOverTitle }}</template>
      <UForm
          :ref="FORM_REF_NAME"
          :schema="formSchema"
          :state="formState"
          class="space-y-4"
          :validate-on="['submit']"
          @submit="handleSubmit"
      >
        <UFormGroup label="Board name" name="name">
          <UInput v-model="formState.name"/>
        </UFormGroup>
        <UFormGroup label="Cover image" name="coverImage">
          <ImagePicker v-model="formState.coverImage"/>
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