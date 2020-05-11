<template>
  <svg width="1" height="1" viewBox="0 0 1 1" class="pointer-events-none">
    <defs>
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation=".2" />
      </filter>
    </defs>

    <g class="transform scale-90 origin-center">
      <rect x="0" y="0" width="1" height="1" fill="rgba(100,100,100,.2)" style="position:relative; z-index: -1;" />
      <circle cx="0.5" cy="0.5" r="0.4" :fill="color" filter="url(#blur)" style="opacity: .75; transition: fill .5s"  />

      <g style="fill:none; stroke:#FFFFFF; stroke-width:0.01;">
        <polyline points="0,.95 1,.95" />

        <g v-if="modifier.cracks > 0">
          <line x1="1" y1="0.62" x2="0.58" y2="0.8"/>
          <polyline points="0,0.89 0.31,0.7 0.7,0 	"/>
          <polyline points="1,0.15 0.95,0.2 0.63,0.12 	"/>
          <line x1="0.31" y1="0.7" x2="1" y2="0.95"/>
          <line x1="0.38" y1="0.58" x2="0.44" y2="0.75"/>
        </g>

        <g v-if="modifier.cracks > 1">
          <line x1="0" y1="0.44" x2="0.43" y2="0.48"/>
          <polyline points="0,0.16 0.24,0 0.56,0.24 	"/>
          <line x1="0.7" y1="0" x2="0.38" y2="0.11"/>
          <line x1="0.18" y1="1" x2="0.37" y2="0.72"/>
          <line x1="0.93" y1="1" x2="0.92" y2="0.92"/>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import anime from 'animejs'

import { isDot } from 'utils/tileGenerator'

import mixin from 'components/canvas/modifiers/mixin'

const createSvgElement = (tag, attrs = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

  Object.entries(attrs).forEach(([name, value]) => {
    element.setAttribute(name, value)
  })

  return element
}

const randomColor = () => {
  const colors = ['#FC8181', '#FBD38D', '#9AE6B4', '#90CDF4', '#D6BCFA']
  return colors[Math.floor(Math.random() * colors.length)]
}

export default {
  mixins: [mixin],

  computed: {
    color() {
      return isDot(this.modifier.tile)
        ? this.theme.colorMap.dots[this.modifier.tile.color]
        : 'rgba(255,255,255,.5)'
    }
  },

  methods: {
    animateCrack() {
      const targets = [...Array(8)].map(() => {
        return createSvgElement('circle', { cx: 0.5, cy: 0.5, r: 0.15, fill: randomColor() })
      })

      targets.forEach(element => this.$el.appendChild(element))

      anime({
        targets: targets,
        translateX: () => anime.random(-1, 2),
        translateY: () => anime.random(-1, 2),
        scale: 0,
        opacity: 0,
        easing: 'easeOutSine',
        duration: () => anime.random(500, 700),
        complete: () => targets.forEach(element => this.$el.removeChild(element))
      });
    }
  }
}
</script>