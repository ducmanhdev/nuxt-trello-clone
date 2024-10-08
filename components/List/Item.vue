<script lang="ts" setup>
import { LazySlideCard } from '#components'
import draggable from 'vuedraggable'
import { SLIDE_CONTROLLER_PROVIDE_NAME } from '~/constant'
import type { CardDocument } from '~/server/models/Card'
import type { ListDocument } from '~/server/models/List'
import type { SlideController } from '~/types'

const props = defineProps<{
  list: ListDocument
  boardId: string
}>()

const toast = useCustomToast()
const cardProps = useCardProps()
const slideController = inject<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME)

const { data: cards, refresh: refreshCards } = await useFetch<CardDocument[]>(
  `/api/lists/${props.list._id}/cards`,
)

const handleCardChange = async (e: any) => {
  try {
    if (e.added) {
      const { element: card } = e.added
      await $fetch(`/api/lists/${props.list._id}/cards/${card._id}`, {
        body: {
          list: props.list._id,
        },
        method: 'PATCH',
      })
    }

    await $fetch(`/api/lists/${props.list._id}`, {
      body: {
        cards: cards.value?.flatMap(item => item._id),
      },
      method: 'PATCH',
    })
    await refreshCards()
  }
  catch (error: any) {
    toast.error({
      title: 'Error',
      description: error.message || 'Something went wrong',
    })
  }
}

const slideCardRef = ref<InstanceType<typeof LazySlideCard>>()
const handleSetSlideCardRef = (el: any) => slideCardRef.value = el
</script>

<template>
  <UCard
    class="w-72 list"
    v-bind="cardProps"
  >
    <template #header>
      <div class="list-header grid grid-cols-[1fr_auto] items-center gap-2 cursor-grab">
        <p class="text-md">
          {{ list.name }}
        </p>
        <UTooltip text="Edit">
          <UButton
            icon="ion:settings"
            variant="ghost"
            class="ignore-drag"
            @click.stop="slideController?.handleEditList({
              _id: list._id.toString(),
              board: list.board,
              name: list.name,
            })"
          />
        </UTooltip>
      </div>
    </template>
    <draggable
      v-if="cards"
      handle=".drag-button"
      :list="cards"
      item-key="_id"
      group="list"
      :scroll-sensitivity="500"
      :force-fallback="true"
      ghost-class="ghost-card"
      drag-class="dragging-card"
      class="space-y-2 flex-1 overflow-y-auto"
      @change="e => handleCardChange(e)"
    >
      <template #item="{ element }">
        <div>
          <ListCard
            :card="element"
            @click="slideCardRef?.show({
              listId: props.list._id.toString(),
              _id: element._id,
              name: element.name,
            })"
          />
        </div>
      </template>
    </draggable>
    <template #footer>
      <UButton
        block
        icon="ion:add"
        label="Add card"
        variant="ghost"
        @click="slideCardRef?.show({
          listId: props.list._id.toString(),
        })"
      />
    </template>
  </UCard>

  <Teleport to="body">
    <LazySlideCard
      :ref="handleSetSlideCardRef"
      @refresh="refreshCards()"
    />
  </Teleport>
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
