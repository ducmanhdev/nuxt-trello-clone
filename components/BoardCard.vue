<script setup lang="ts">
defineProps<{
  name: string
  coverImage?: string
}>()

const emit = defineEmits<{
  (e: 'onEdit'): void
}>()
</script>

<template>
  <UCard class="relative overflow-hidden">
    <NuxtImg
      v-if="coverImage"
      :src="coverImage"
      :alt="name"
      placeholder
      class="h-full w-full absolute top-0 left-0 object-cover"
    />
    <div class="h-full w-full absolute top-0 left-0 bg-black/25" />
    <div class="relative grid grid-cols-[1fr_auto] items-center gap-2">
      <p class="text-md">
        {{ name }}
      </p>
      <UTooltip text="Edit">
        <UButton icon="ion:settings" variant="ghost" @click.stop="emit('onEdit')" />
      </UTooltip>
    </div>
  </UCard>
</template>

<style scoped>

</style>
