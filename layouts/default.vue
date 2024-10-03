<script setup lang="ts">
import {useBoard, type HandleEditBoard} from "~/composables/useBoard";

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
});

const {data, signOut} = useAuth();
const userDropdownItems = [
  [
    {
      label: 'Profile',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4'
      }
    },
    {
      label: 'Settings',
      icon: 'ion:ios-settings',
    }
  ],
  [
    {
      label: 'Sign out',
      icon: 'ion:log-out-outline',
      click: signOut
    }
  ]
];

const route = useRoute();

const {
  slideOverTitle,
  isCreateBoardOpen,
  handleCreateBoard,
  handleEditBoard,
  FORM_REF_NAME,
  formState,
  formSchema,
  isSubmitLoading,
  handleSubmit,
  handleTriggerSubmit,
  isCanDelete,
  isDeleteLoading,
  handleDelete
} = useBoard();

provide<HandleEditBoard>("handleEditBoard", handleEditBoard);
</script>

<template>
  <div>
    <header class="py-4">
      <UContainer class="flex justify-between items-center">
        <div class="logo">TRELLO</div>
        <div class="flex items-center gap-2">
          <UButton
              v-if="route.name === 'TEST'"
              icon="ion:add"
              size="sm"
              variant="solid"
              label="Create list"
              @click="() => {}"
          />
          <UButton

              icon="ion:add"
              size="sm"
              variant="solid"
              label="Create board"
              @click="handleCreateBoard"
          />
          <ClientOnly>
            <UButton
                :icon="isDark ? 'ion:moon' : 'ion:sunny'"
                variant="ghost"
                aria-label="Theme"
                @click="isDark = !isDark"
            />
            <template #fallback>
              <div class="w-8 h-8"/>
            </template>
          </ClientOnly>
          <UDropdown
              :items="userDropdownItems"
              :popper="{ placement: 'bottom-start' }"
          >
            <UButton
                icon="ion:person-circle"
                variant="ghost"
            />
          </UDropdown>
        </div>
      </UContainer>
    </header>
    <main>
      <slot/>
    </main>
  </div>

  <USlideover v-model="isCreateBoardOpen">
    <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
    >
      <template #header>{{ slideOverTitle }}</template>
      <UForm
          :ref="FORM_REF_NAME"
          :schema="formSchema"
          :state="formState"
          class="space-y-4"
          validate-on="submit"
          @submit="handleSubmit"
      >
        <UFormGroup label="Board name" name="name">
          <UInput v-model="formState.name"/>
        </UFormGroup>
        <UFormGroup label="Cover image" name="coverImage">
          <ImagePicker v-model="formState.coverImage"/>
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex gap-2">
          <UButton
              v-if="isCanDelete"
              type="button"
              color="red"
              block
              class="flex-1"
              :loading="isDeleteLoading"
              @click="handleDelete"
          >
            Delete
          </UButton>
          <UButton
              type="button"
              block
              class="flex-1"
              :loading="isSubmitLoading"
              @click="handleTriggerSubmit"
          >
            Submit
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>