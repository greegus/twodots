<template>
  <transition
    enter-active-class="transition-opacity duration-150"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <slot />
  </transition>
</template>