<script lang="ts" setup>

const runtimeConfig = useRuntimeConfig()
const pixabayApiKey = runtimeConfig.public.pixabayApiKey;

type Data = {
  total: number
  totalHits: number
  hits: Hit[]
}

type Hit = {
  id: number
  pageURL: string
  type: string
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  collections: number
  likes: number
  comments: number
  user_id: number
  user: string
  userImageURL: string
}

const {data} = await useFetch<Data>(
    `https://pixabay.com/api/?key=${pixabayApiKey}&image_type=photo&orientation=horizontal&per_page=32`
);

const model = defineModel();
const handleSelectImage = (imageUrl: string) => {
  model.value = model.value === imageUrl ? undefined : imageUrl;
}
</script>

<template>
  <ol
      v-if="data.hits"
      class="grid grid-cols-3 gap-2 overflow-y-auto h-96 p-1"
  >
    <li
        v-for="image in data.hits"
        :key="image.id"
        class="h-24 relative rounded overflow-hidden cursor-pointer outline"
        :class="[model === image.largeImageURL ? 'outline-primary' : 'outline-transparent']"
        @click="handleSelectImage(image.largeImageURL)"
    >
      <NuxtImg
          :src="image.previewURL"
          class="w-full h-full absolute object-cover"
          loading="lazy"
      />
    </li>
  </ol>
</template>

<style></style>