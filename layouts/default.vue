<script setup lang="ts">
import { LazySlideBoard, LazySlideList } from '#components'
import { SLIDE_CONTROLLER_PROVIDE_NAME } from '~/constant'
import type { UserDocument } from '~/server/models/User'
import type { SlideController } from '~/types'

const { handleSubscribe, handleAccessPortal } = useSubscription()

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const { data, signOut } = useAuth()

const isUserHasSubscripton = computed(() => (data.value?.user as UserDocument)?.hasActiveSubscription)

const userDropdownItems = computed(() => {
  return [
    [
      {
        label: 'Profile',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/739984?v=4',
        },
      },
      {
        label: 'Settings',
        icon: 'ion:ios-settings',
      },
    ],
    ...(isUserHasSubscripton.value
      ? [[
          {
            label: 'Billing',
            icon: 'ion:receipt-outline',
            click: handleAccessPortal,
          },
        ]]
      : []),
    [
      {
        label: 'Sign out',
        icon: 'ion:log-out-outline',
        click: signOut,
      },
    ],
  ]
})

const route = useRoute()
const currentBoardId = computed(() => route.params.boardId)

const slideBoardRef = ref<InstanceType<typeof LazySlideBoard>>()
const handleSetEditBoardRef = (el: any) => slideBoardRef.value = el
const handleEditBoard: SlideController['handleEditBoard'] = (arg) => {
  slideBoardRef.value?.show(arg)
}

const slideListRef = ref<InstanceType<typeof LazySlideList>>()
const handleSetEditListRef = (el: any) => slideListRef.value = el
const handleEditList: SlideController['handleEditList'] = (arg) => {
  slideListRef.value?.show(arg)
}

provide<SlideController>(SLIDE_CONTROLLER_PROVIDE_NAME, {
  handleEditBoard,
  handleEditList,
})
</script>

<template>
  <div>
    <header class="py-4 shadow">
      <UContainer class="flex justify-between items-center">
        <RouterLink to="/">
          TRELLO
        </RouterLink>
        <div class="flex items-center gap-2">
          <UButton
            v-if="route.name === 'boardId'"
            icon="ion:add"
            size="sm"
            variant="solid"
            label="Create list"
            @click="slideListRef?.show({
              board: currentBoardId as string,
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
          <UButton
            v-if="!isUserHasSubscripton"
            color="yellow"
            :disabled="isUserHasSubscripton"
            icon="ion:ios-star-outline"
            @click="handleSubscribe"
          />
          <ClientOnly>
            <UButton
              :icon="isDark ? 'ion:moon' : 'ion:sunny'"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
            <template #fallback>
              <div class="w-8 h-8" />
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
      <slot />
    </main>

    <Teleport to="body">
      <LazySlideBoard :ref="handleSetEditBoardRef" />
      <LazySlideList :ref="handleSetEditListRef" />
      <LazyModalConfirm />
    </Teleport>
  </div>
</template>
