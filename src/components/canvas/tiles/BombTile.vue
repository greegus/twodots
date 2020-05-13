<template>
  <g class="BombTile">
    <g v-for="(beam, $index) in beams" :key="$index">
      <g :style="`transform: rotate(${beam.beamAngle}deg); transform-origin: 0.5px 0.5px`">
        <polyline points="0.5,-0.75 0.5,0.5" stroke="#333" stroke-width=".1" ref="beams" style="transform-origin: 0.5px 0.5px; stroke-dasharray: 1 1" />
      </g>

      <g :style="`transform: translate(${beam.flashPosition.x}px,${beam.flashPosition.y}px); transform-origin: 0.5px 0.5px`">
        <circle cx="0.5" cy="0.5" r="0.261" fill="#333" ref="flashes" style="transform-origin: 0.5px 0.5px" />
      </g>
    </g>

    <circle cy=".5" cx=".5" r="0.26" fill="#333" ref="bomb" />
    <circle cy=".5" cx=".5" r="0.26" fill="black" ref="ring1" style="transform-origin: 0.5px 0.5px" />
    <circle cy=".5" cx=".5" r="0.26" fill="#333" ref="ring2" style="transform-origin: 0.5px 0.5px" />
  </g>
</template>

<script>
import anime from 'animejs'

import mixin from 'components/canvas/tiles/mixin'

export default {
  mixins: [mixin],

  data() {
    return {
      beams: []
    }
  },

  methods: {
    animateDetonation(neighbourTiles) {
      this.beams = neighbourTiles.map(tile => {
        const flashPosition = {
          x: tile.position.x - this.tile.position.x,
          y: tile.position.y - this.tile.position.y
        }

        const beamAngle = Math.atan2(flashPosition.y, flashPosition.x) * 180 / Math.PI + 90

        return {
          flashPosition,
          beamAngle
        }
      })

      return new Promise(resolve => {
        this.$nextTick(() => {
          anime({
            targets: this.$refs.beams,
            complete: resolve,
            strokeDashoffset: [
              { value: [-1, 0], duration: 200, easing: 'easeInQuad'},
              { value: [0, 1], duration: 200, easing: 'easeInQuad', delay: 100 }
            ],
            opacity: {
              value: [1, 0],
              duration: 1,
              delay: 400,
              easing: 'linear',
            }
          })

          anime({
            targets: this.$refs.flashes,
            easing: 'linear',
            duration: 150,
            opacity: {
              value: [0, 1]
            },
            scale: {
              value: [1, 0],
              delay: 400,
            }
          })
        })
      })
    }
  },

  mounted() {
    const hexColor = this.theme.colorMap.dots[this.tile.originalTile.color]

    anime({
      targets: this.$refs.bomb,
      fill: [hexColor || '#333', '#333'],
      duration: 200,
      easing: 'linear'
    })

    anime({
      targets: this.$refs.ring1,
      scale: [0, 1],
      easing: 'linear',
      duration: 500,
      loop: true,
      endDelay: 200,
    })

    anime({
      targets: this.$refs.ring2,
      scale: [0, 1],
      easing: 'linear',
      duration: 500,
      loop: true,
      delay: 200,
    })
  }
}
</script>
