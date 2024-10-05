<script lang="ts" setup>
import { SLIDE_CONTROLLER_PROVIDE_NAME } from '~/constant'
import type { ListDocument } from '~/server/models/List'
import type { SlideController } from '~/types'

defineProps<{
  list: ListDocument
  boardId: string
}>()

const cardProps = useCardProps()
const slideController = inject<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME)
</script>

<template>
  <UCard
    :class="cardProps.class"
    :ui="{
      ...cardProps.ui,
      header: {
        base: 'list-header',
      },
    }"
    class="w-72"
  >
    <template #header>
      <div class="grid grid-cols-[1fr_auto] items-center gap-2">
        <p class="text-md">
          {{ list.name }}
        </p>
        <UTooltip text="Edit">
          <UButton
            icon="ion:settings"
            variant="ghost"
            class="ignore-drag"
            @click.stop="slideController?.handleEditList(list)"
          />
        </UTooltip>
      </div>
    </template>
    <div />
    <template #footer>
      <UButton
        block
        icon="ion:add"
        label="Add card"
        variant="ghost"
        @click="showCreateCard = true"
      />
    </template>
  </UCard>
</template>

<style scoped>
.ghost-card {
  @apply !bg-gray-100 dark:!bg-gray-700 rounded-lg;
}

.ghost-card > div {
  @apply invisible;
}

.dragging-card {
  @apply transform rotate-2 shadow-xl !cursor-grabbing;
}

.sortable-chosen {
  opacity: 1 !important;
  cursor: grabbing;
}
</style>
