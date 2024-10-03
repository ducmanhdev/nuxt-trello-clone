import type {FormSubmitEvent} from '#ui/types'
import {z} from "zod";
import BoardSchema from "~/schemas/Board.schema";
import {Schema} from "mongoose";
import {useEvent} from "~/composables/useEmitt";

type EditBoardParams = z.infer<typeof BoardSchema> & {
    _id: Schema.Types.ObjectId
}

export type HandleEditBoard = (oldValue: EditBoardParams) => void;

export const useBoard = () => {
    const toast = useCustomToast();

    const slideOverTitle = computed(() => {
        return currentBoardId.value ? "Update board" : "Create board";
    })

    const isCreateBoardOpen = ref(false);
    const handleCreateBoard = () => {
        handleResetState();
        isCreateBoardOpen.value = true;
    }

    const currentBoardId = ref<Schema.Types.ObjectId>(undefined);
    const handleEditBoard: HandleEditBoard = (oldValue) => {
        currentBoardId.value = oldValue._id;
        formState.value.name = oldValue.name;
        formState.value.coverImage = oldValue.coverImage;
        isCreateBoardOpen.value = true;
    }

    const INITIAL_FORM_STATE = {
        name: undefined,
        coverImage: undefined,
    }
    const formState = ref({...INITIAL_FORM_STATE});
    const handleResetState = () => {
        currentBoardId.value = undefined;
        formState.value = {...INITIAL_FORM_STATE};
    }

    const FORM_REF_NAME = "boardForm";
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

    const handleTriggerSubmit = () => {
        formRef.value?.submit()
    }

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

    return {
        slideOverTitle,
        isCreateBoardOpen,
        handleCreateBoard,
        handleEditBoard,

        formState,
        FORM_REF_NAME,
        formSchema,
        isSubmitLoading,
        handleSubmit,
        handleTriggerSubmit,
        isCanDelete,
        isDeleteLoading,
        handleDelete
    };
};