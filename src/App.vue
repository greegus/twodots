<template>
  <div class="w-screen h-screen overflow-hidden bg-gray-100 select-none font-sans font-light">
    <FadeTransition :duration="300">
      <router-view class="h-screen w-screen overflow-y-auto" />
    </FadeTransition>
  </div>
</template>

<script>
import FadeTransition from 'transitions/Fade'

export default {
  components: {
    FadeTransition
  }
}
</script>

<style>
  @import url('./assets/styles/styles.css');
</style>
