<script setup lang="ts">
import {useSignUp} from "~/composables/useSignUp";

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

useHead({
  title: "Sign Up",
});

const {formState, FORM_REF_NAME, isLoading, validationSchema, handleSubmit} = useSignUp();
</script>

<template>
  <section class="min-h-screen grid place-content-center">
    <UCard class="w-[600px] max-w-full">
      <template #header>
        <h2 class="text-2xl font-bold text-center">SIGN UP</h2>
      </template>
      <UForm
          :ref="FORM_REF_NAME"
          :schema="validationSchema"
          :state="formState"
          class="space-y-4"
          @submit="handleSubmit"
      >
        <UFormGroup label="Name" name="name">
          <UInput v-model="formState.name"/>
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="formState.email"/>
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="formState.password" type="password"/>
        </UFormGroup>
        <UFormGroup label="Confirm password" name="confirmPassword">
          <UInput v-model="formState.confirmPassword" type="password"/>
        </UFormGroup>
        <UButton type="submit" block :loading="isLoading">
          Submit
        </UButton>
      </UForm>
      <template #footer>
        <p class="text-center">
          Already have an account?
          <RouterLink to="/auth/sign-in" class="text-primary">Sign In</RouterLink>
        </p>
      </template>
    </UCard>
  </section>
</template>

