<script setup lang="ts">

withDefaults(defineProps<{
  duration?: number
}>(), {
  duration: 150
})
</script>

<template>
  <transition
    :enter-active-class="`transition-opacity duration-${duration}`"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    :leave-active-class="`transition-opacity duration-${duration}`"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <slot />
  </transition>
</template>
