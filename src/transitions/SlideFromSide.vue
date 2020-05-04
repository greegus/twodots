<template>
  <transition
    enter-active-class="transform transition-transform duration-150 ease-out"
    enter-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition-transform duration-150 ease-in"
    leave-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <slot />
  </transition>
</template>