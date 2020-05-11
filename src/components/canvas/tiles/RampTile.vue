<template>
  <g>
    <image xlink:href="~/assets/images/tiles/ramp.svg" width="1" height="1" :style="{ transformOrigin: '0.5px 0.5px', transform: tile.orientation === 'left' ? 'rotateY(180deg)' : '' }" />
  </g>
</template>

<script>
import mixin from 'components/canvas/tiles/mixin'

export default {
  mixins: [mixin]
}
</script>
