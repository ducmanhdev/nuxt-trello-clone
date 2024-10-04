<script lang="ts" setup>
import draggable from "vuedraggable";
import type {ListDocument} from "~/server/models/List";

const props = defineProps<{
  boardId: string;
  lists: ListDocument[];
}>();

const toast = useCustomToast();
const handleSort = async () => {
  try {
    await $fetch(`/api/boards/${props.boardId}/lists/sort`, {
      method: "PATCH",
      body: {
        lists: props.lists.flatMap(list => list._id),
      },
    });
  } catch (error) {
    toast.error({
      title: 'Error',
      description: error.data?.message || "An unknown error occurred",
    })
  }
};
</script>

<template>
  <draggable
      :list="lists"
      handle=".list-header"
      ghost-class="ghost-board"
      drag-class="dragging-board"
      item-key="_id"
      :scroll-sensitivity="500"
      :force-fallback="true"
      filter=".ignore-drag"
      @sort="handleSort"
      class="flex h-[80vh] overflow-x-auto gap-4 pb-2 list"
  >
    <template #item="{ element }">
      <div class="flex">
        <ListItem
            :list="element"
            :board-id="boardId"
        />
      </div>
    </template>
  </draggable>
</template>

<style>
.ghost-board > div {
  @apply opacity-50;
}

.ghost-board > div > div {
  @apply invisible;
}

.dragging-board {
  @apply shadow-2xl transform rotate-2 cursor-grabbing;
}

.list .sortable-chosen {
  overflow: hidden;
  opacity: 1 !important;
}
</style>