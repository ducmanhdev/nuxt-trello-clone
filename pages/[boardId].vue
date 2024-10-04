<script lang="ts" setup>
import type {BoardDocument} from "~/server/models/Board";
import type {ListDocument} from "~/server/models/List";

const route = useRoute();
const {boardId} = route.params;

const {data, refresh} = await useFetch<BoardDocument>(`/api/boards/${boardId}`);
useListen('refresh-lists', refresh);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Board not found",
  });
}

useHead({
  title: data.value.name,
});

const lists = computed<ListDocument[]>(() => data.value.lists);
</script>

<template>
  <section>
    <UContainer>
      <ListContainer
          :lists="lists"
          :board-id="boardId"
      />
    </UContainer>
  </section>
</template>

<style></style>