<script setup lang="ts">
import {useSignIn} from "~/composables/useSignIn";

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

useHead({
  title: "Sign In",
});

const {formState, isLoading, validationSchema, handleSubmit} = useSignIn();
</script>

<template>
  <section class="min-h-screen grid place-content-center">
    <UCard class="w-[600px] max-w-full">
      <template #header>
        <h2 class="text-2xl font-bold text-center">SIGN IN</h2>
      </template>
      <UForm :schema="validationSchema" :state="formState" class="space-y-4" @submit="handleSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="formState.email"/>
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="formState.password" type="password"/>
        </UFormGroup>
        <UButton type="submit" block :loading="isLoading">
          Submit
        </UButton>
      </UForm>
      <template #footer>
        <p class="text-center">
          Don't have an account?
          <RouterLink to="/auth/sign-up" class="text-primary">Sign up</RouterLink>
        </p>
      </template>
    </UCard>
  </section>
</template>

