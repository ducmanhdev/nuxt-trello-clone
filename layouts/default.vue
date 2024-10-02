<script setup lang="ts">
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
</script>

<template>
  <div>
    <header class="py-4">
      <UContainer class="flex justify-between items-center">
        <div class="logo">TRELLO</div>
        <div class="flex items-center gap-2">
          <UButton
              icon="ion:add"
              size="sm"
              variant="solid"
              label="Create list"
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
</template>