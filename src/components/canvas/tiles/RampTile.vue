<template>
  <g>
    <image xlink:href="~/assets/images/tiles/ramp.svg" width="1" height="1" :style="{ transformOrigin: '0.5px 0.5px', transform: tile.direction === 'left' ? 'rotateY(180deg)' : '' }" />
  </g>
</template>

<script>
export default {
  props: {
    tile: {
      type: Object,
      required: true
    }
  }
}
</script>

