<script setup lang="ts">
const { isOpen, cancelAction, confirmAction, isActionLoading } = useSubscriptionModal()
const { pricing } = useSubscription()
</script>

<template>
  <UModal v-model="isOpen">
    <UCard class="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
      <template #header>
        Subscribe to Pro Plan
      </template>

      <div class="text-center">
        <p class="mb-4 text-5xl text-yellow-500 font-bold">
          ${{ pricing }}
        </p>
        <p class="mb-4 text-xl">
          Unlock all premium features
        </p>

        <ul class="space-y-2 mb-4 text-gray-600 dark:text-gray-400">
          <li>✔ Access to all premium content</li>
          <li>✔ Priority customer support</li>
          <li>✔ Exclusive features and updates</li>
        </ul>
      </div>

      <template #footer>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            label="Cancel"
            variant="ghost"
            class="w-full py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            block
            @click="cancelAction"
          />
          <UButton
            label="Subscribe"
            class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg"
            block
            :loading="isActionLoading"
            @click="confirmAction"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
