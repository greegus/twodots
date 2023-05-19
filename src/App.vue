<script setup lang="ts">
import FadeTransition from '@/transitions/FadeTransition.vue'
import { ModalStack } from 'vuiii'
</script>

<template>
  <div class="w-screen h-screen overflow-hidden bg-gray-100 select-none font-sans font-light">
    <RouterView class="h-screen w-screen overflow-y-auto" v-slot="{ Component }">
      <FadeTransition>
        <component :is="Component" />
      </FadeTransition>
    </RouterView>

  </div>

  <ModalStack />
</template>
