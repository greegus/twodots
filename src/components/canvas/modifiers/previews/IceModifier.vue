<template>
  <svg viewBox="0 0 1 1">
    <circle cx=".5" cy=".5" r=".5" fill="#fff" />
    <image class="object-contain overflow-hidden" href="~/assets/images/tiles/ice.svg" width="1" height="1" preserveAspectRatio="none" />
  </svg>
</template>

<script>
import mixin from 'components/canvas/modifiers/mixin'

export default {
  mixins: [mixin]
}
</script>