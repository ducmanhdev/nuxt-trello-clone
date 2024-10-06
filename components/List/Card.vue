<script lang="ts" setup>
import type { CardDocument } from '~/server/models/Card'

defineProps<{
  card: CardDocument
}>()
</script>

<template>
  <div
    class="cursor-pointer p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700 grid grid-cols-[1fr_auto] items-center gap-2"
  >
    <span>{{ card.name }}</span>
    <UButton
      size="2xs"
      variant="ghost"
      icon="ion:move-sharp"
      class="drag-button cursor-grab"
      @click.stop
    />
  </div>
</template>

<style></style>
