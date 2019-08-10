<template>
  <g>
    <svg :width="size.width + 2" :height="size.height + 2" x="-1" y="-1">
      <defs>
        <filter id="shadow">
          <feOffset in="SourceGraphic" dy=".1" />
          <feGaussianBlur result="blurOut" stdDeviation=".1" />
        </filter>

        <mask id="mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect v-for="tile in walls" :key="tile.id" width="1" height="1" :x="tile.x + 1" :y="tile.y + 1" fill="black" />
        </mask>

        <clipPath id="clipPath">
          <rect v-for="tile in walls" :key="tile.id" width="1" height="1" :x="tile.x + 1" :y="tile.y + 1" fill="black" />
        </clipPath>
      </defs>

      <g filter="url(#shadow)" clip-path="url(#clipPath)">
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,.2)" mask="url(#mask)" />
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,.025)" />
      </g>
    </svg>
  </g>
</template>

<script>
export default {
  props: {
    walls: {
      type: Array,
      default: () => []
    },

    size: {
      type: Object,
      required: true
    }
  }
}
</script>
