<script setup lang="ts">
import { FETCH_BOARD_KEY, SLIDE_CONTROLLER_PROVIDE_NAME } from '~/constant'
import type { BoardDocument } from '~/server/models/Board'
import type { SlideController } from '~/types'

useHead({
  title: 'Nuxt trello',
})

const router = useRouter()
const slideController = inject<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME)
const { data } = await useFetch<BoardDocument[]>('/api/boards', {
  key: FETCH_BOARD_KEY,
})
</script>

<template>
  <UContainer>
    <section class="grid grid-cols-4 gap-4">
      <BoardCard
        v-for="board in data"
        :key="board._id.toString()"
        :name="board.name"
        :cover-image="board.coverImage"
        class="cursor-pointer"
        @on-edit="slideController?.handleEditBoard({
          _id: board._id.toString(),
          name: board.name,
          coverImage: board.coverImage,
        })"
        @click="router.push({ name: 'boardId', params: { boardId: board._id.toString() } })"
      />
    </section>
  </UContainer>
</template>
