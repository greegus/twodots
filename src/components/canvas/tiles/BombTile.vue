<script setup lang="ts">
import { type Theme, type Tile, type BombTile, type Point, TileType } from '@/types.d';
import anime from 'animejs'
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{
  tile: BombTile,
  theme: Theme
}>()

const beams = ref<{ flashPosition: Point, beamAngle: number }[]>([])
const flashes = ref<SVGCircleElement[]>([])
const bomb = ref<SVGCircleElement[]>([])
const ring1 = ref<SVGCircleElement>()
const ring2 = ref<SVGCircleElement>()

const animateDetonation = (neighbourTiles: Tile[]) => {
  beams.value = neighbourTiles.map(tile => {
    const flashPosition = {
      x: tile.position.x - props.tile.position.x,
      y: tile.position.y - props.tile.position.y
    }

    const beamAngle = Math.atan2(flashPosition.y, flashPosition.x) * 180 / Math.PI + 90

    return {
      flashPosition,
      beamAngle
    }
  })

  return new Promise(resolve => {
    nextTick(() => {
      anime({
        targets: beams.value,
        complete: resolve,
        strokeDashoffset: [
          { value: [-1, 0], duration: 200, easing: 'easeInQuad' },
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
        targets: flashes.value,
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


onMounted(() => {
  const hexColor = props.tile.originalTile.type === TileType.DOT && props.theme.colorMap.dots[props.tile.originalTile.color] || '#333'

  anime({
    targets: bomb.value,
    fill: [hexColor || '#333', '#333'],
    duration: 200,
    easing: 'linear'
  })

  anime({
    targets: ring1.value,
    scale: [0, 1],
    easing: 'linear',
    duration: 500,
    loop: true,
    endDelay: 200,
  })

  anime({
    targets: ring2.value,
    scale: [0, 1],
    easing: 'linear',
    duration: 500,
    loop: true,
    delay: 200,
  })
})

defineExpose({
  animateDetonation
})
</script>


<template>
  <g class="BombTile">
    <g v-for="(beam, $index) in beams" :key="$index">
      <g :style="`transform: rotate(${beam.beamAngle}deg); transform-origin: 0.5px 0.5px`">
        <polyline points="0.5,-0.75 0.5,0.5" stroke="#333" stroke-width=".1" ref="beams"
          style="transform-origin: 0.5px 0.5px; stroke-dasharray: 1 1" />
      </g>

      <g
        :style="`transform: translate(${beam.flashPosition.x}px,${beam.flashPosition.y}px); transform-origin: 0.5px 0.5px`">
        <circle cx="0.5" cy="0.5" r="0.261" fill="#333" ref="flashes" style="transform-origin: 0.5px 0.5px" />
      </g>
    </g>

    <circle cy=".5" cx=".5" r="0.26" fill="#333" ref="bomb" />
    <circle cy=".5" cx=".5" r="0.26" fill="black" ref="ring1" style="transform-origin: 0.5px 0.5px" />
    <circle cy=".5" cx=".5" r="0.26" fill="#333" ref="ring2" style="transform-origin: 0.5px 0.5px" />
  </g>
</template>
