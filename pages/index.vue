<script setup lang="ts">
import {type HandleEditBoard} from "~/composables/useBoard";
import {type BoardDocument} from "~/server/models/Board";

const handleEditBoard = inject<HandleEditBoard>("handleEditBoard");
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
          @on-edit="handleEditBoard(board)"
      />
    </section>
  </UContainer>
</template>

<style scoped>

</style>