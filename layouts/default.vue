<script setup lang="ts">
import {SLIDE_CONTROLLER_PROVIDE_NAME} from "~/constant";
import type {SlideController} from "~/types";

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
});

const {signOut} = useAuth();
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
const currentBoardId = computed(() => route.params.boardId);

const SLIDE_BOARD_REF_NAME = "SLIDE_BOARD_REF_NAME";
const slideBoardRef = useTemplateRef(SLIDE_BOARD_REF_NAME);
const handleEditBoard: SlideController["handleEditBoard"] = (arg) => {
  slideBoardRef.value?.show(arg);
}

const SLIDE_LIST_REF_NAME = "SLIDE_LIST_REF_NAME";
const slideListRef = useTemplateRef(SLIDE_LIST_REF_NAME);
const handleEditList: SlideController["handleEditList"] = (arg) => {
  slideListRef.value?.show(arg);
}

provide<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME, {
  handleEditBoard,
  handleEditList
});
</script>

<template>
  <div>
    <header class="py-4">
      <UContainer class="flex justify-between items-center">
        <div class="logo">TRELLO</div>
        <div class="flex items-center gap-2">
          <UButton
              v-if="route.name === 'boardId'"
              icon="ion:add"
              size="sm"
              variant="solid"
              label="Create list"
              @click="slideListRef?.show({
                board: currentBoardId
              })"
          />
          <UButton
              v-else
              icon="ion:add"
              size="sm"
              variant="solid"
              label="Create board"
              @click="slideBoardRef?.show()"
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

    <Teleport to="body">
      <SlideBoard :ref="SLIDE_BOARD_REF_NAME"/>
      <SlideList :ref="SLIDE_LIST_REF_NAME"/>
    </Teleport>
  </div>
</template>