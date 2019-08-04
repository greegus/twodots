<template>
  <svg class="absolute top-0 left-0 w-screen h-screen pointer-events-none z-10">
    <g v-for="(corner, $index) in corners" :key="$index" :style="`transform-origin: 25% 25%; transform: ${corner}`">
      <polyline
        stroke-width="30"
        style="transition: stroke-dasharray .15s"
        :points="points" height="100" fill="none" :stroke="visibleColor"
        :style="style"
      />
    </g>

    <rect x="0" y="0" width="100%" height="100%" :fill="visibleColor" :style="`opacity: ${length && isClosed ? .15 : 0}; transition: opacity .15s;`" />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: undefined
    },

    length: {
      type: Number,
      default: 0
    },

    isClosed: {
      type: Boolean
    },
  },

  data() {
    return {
      points: '',
      style: '',
      visibleColor: undefined,
      corners: [
        'translate(0, 0)',
        'translate(50%, 0) rotateY(180deg)',
        'translate(50%, 50%) rotateX(180deg) rotateY(180deg)',
        'translate(0%, 50%) rotateX(180deg)'
      ]
    }
  },

  methods: {
    render() {
      if (!this.$el) {
        return
      }

      if (this.color) {
        this.visibleColor = this.color
      }

      const length = Math.max(0, this.length - 2)
      const { clientWidth, clientHeight } = this.$el

      this.points = `${clientWidth / 2},0 0,0 0,${clientHeight / 2}`

      const fullLength = (clientWidth + clientHeight) / 2
      const progress = Math.min(1, length && this.isClosed ? 1 : (length / 20))
      const line = progress * fullLength
      const gap = Math.max(0, fullLength - line)

      this.style = {
        strokeDasharray: `${line} ${gap}`
      }
    }
  },

  watch: {
    length: {
      immediate: true,
      handler: 'render'
    },

    color: {
      handler() {
        if (this.color) {
          this.visibleColor = this.color
        }
      }
    }
  },

  mounted() {
    this.render()
  }
}
</script>
