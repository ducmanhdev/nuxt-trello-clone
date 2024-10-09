<script setup lang="ts">
const { isOpen, cancelAction, confirmAction } = useConfirmModal()
</script>

<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        Confirm Action
      </template>
      Are you sure you want to proceed with this action? This cannot be undone.
      <template #footer>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            label="Cancel"
            variant="ghost"
            block
            @click="cancelAction"
          />
          <UButton
            label="Ok"
            color="red"
            block
            @click="confirmAction"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
