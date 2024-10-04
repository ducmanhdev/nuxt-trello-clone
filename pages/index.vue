<script setup lang="ts">
import {SLIDE_CONTROLLER_PROVIDE_NAME} from "~/constant";
import type {SlideController} from "~/types";
import {type BoardDocument} from "~/server/models/Board";

useHead({
  title: "Nuxt trello"
})

const router = useRouter();
const slideController = inject<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME);
const {data, refresh} = await useFetch<BoardDocument[]>("/api/boards");
useListen('refresh-boards', refresh);
</script>

<template>
  <UContainer>
    <section class="grid grid-cols-4 gap-4">
      <Board
          v-for="board in data as BoardDocument[]"
          :key="board._id"
          :name="board.name"
          :cover-image="board.coverImage"
          @on-edit="slideController?.handleEditBoard(board)"
          class="cursor-pointer"
          @click="router.push({ name: 'boardId', params: { boardId: board._id } })"
      />
    </section>
  </UContainer>
</template>

<style scoped>

</style>