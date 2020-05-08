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

<script>
export default {
  props: {
    duration: {
      type: Number,
      default: 150,
      validator: value => [75, 100, 150, 200, 300, 500, 700, 1000].includes(value)
    }
  }
}
</script>