<template>
  <div class="LevelMenuPanelm overflow-hidden">
    <FadeTransition>
      <div class="fixed inset-0 z-10 bg-black bg-opacity-25" @pointerdown="close()" v-if="isOpen"></div>
    </FadeTransition>

    <SlideFromSide>
      <div class="fixed inset-y-0 right-0 z-10 flex flex-col max-w-md bg-spaceblue-700 rounded-l-2xl" style="width: calc(100% - 3rem)" v-if="isOpen">
        <div class="rounded-tl-2xl bg-spaceblue-800 p-5 text-white">
          <Logo />
        </div>

        <div class="p-5">
          <Button class="w-full mb-5" primary @click="close(); $emit('restart-level')">
            Restart
          </Button>

          <Button class="w-full mb-5" @click="close(); $emit('exit-to-map')">
            Exit to map
          </Button>
        </div>
      </div>
    </SlideFromSide>
  </div>
</template>

<script>
import Logo from 'components/Logo'

import SlideFromSide from 'transitions/SlideFromSide'
import FadeTransition from 'transitions/Fade'

export default {
  components: {
    Logo,
    SlideFromSide,
    FadeTransition
  },

  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    open() {
      this.isOpen = true
      window.addEventListener('keydown', this.close)
    },

    close() {
      this.isOpen = false
      window.removeEventListener('keydown', this.close)
    },

    closeByEsc(e) {
      e.key === 'Escape' && this.close()
    }
  }
}
</script>