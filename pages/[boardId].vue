<script lang="ts" setup>
import { FETCH_LIST_KEY } from '~/constant'
import type { BoardDocument } from '~/server/models/Board'
import type { ListDocument } from '~/server/models/List'

const route = useRoute()
const { boardId } = route.params

const { data } = await useFetch<BoardDocument>(`/api/boards/${boardId}`, {
  key: FETCH_LIST_KEY,
})

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: 'Board not found',
  })
}

useHead({
  title: data.value.name,
})

const lists = computed(() => data.value?.lists as ListDocument[])
</script>

<template>
  <section class="py-8">
    <UContainer>
      <ListContainer
        :lists="lists"
        :board-id="boardId as string"
      />
    </UContainer>
  </section>
</template>

<style></style>
