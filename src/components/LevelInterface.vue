<template>
  <div class="LevelInterface">
    <div class="absolute top-0 inset-x-0 flex w-full align-center justify-center text-gray-700 lg:mt-10 space-x-2 lg:space-x-5 pt-5 px-3">
      <div class="LevelInterface__panel flex-none px-0 w-12 lg:w-16">
        <div class="text-center leading-none">
          <div class="text-2xl lg:text-3xl mb-px -mb-px lg:mb-px" :class="{'text-red-500': isLowOnMovesLeft}">{{ movesLeft }}</div>
          <div class="uppercase text-2xs lg:text-xs font-normal">Moves</div>
        </div>
      </div>

      <div class="LevelInterface__panel flex-auto flex justify-center lg:flex-none px-1 px-3 lg:px-5">
        <div v-for="(goal, $index) in goals" :key="$index" style="flex-basis: 33.333%;">
          <GoalItem :goal="goal" :theme="theme" show-current small class="mx-auto" />
        </div>
      </div>

      <div class="LevelInterface__panel flex-none px-0 w-12 lg:w-16 cursor-pointer hover:bg-gray-200" @click="quitLevel()">
        <Icon name="map" size="lg" />
      </div>
    </div>

    <div class="absolute bottom-0 inset-x-0 flex align-center justify-center w-full text-gray-700 lg:mb-10 px-5 pb-5">
      <div class="LevelInterface__panel w-32 mx-auto">
        <div class="text-center leading-none">
          <div class="uppercase text-2xs lg:text-xs font-normal mb-1">Score</div>
          <div class="text-2xl">{{ score }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoalItem from 'components/GoalItem'

export default {
  components: {
    GoalItem
  },

  props: {
    movesLeft: {
      type: Number,
      required: true
    },

    goals: {
      type: Array,
      required: true
    },

    theme: {
      type: Object,
      required: true
    },

    score: {
      type: Number,
      required: true
    }
  },

  computed: {
    isLowOnMovesLeft() {
      return this.movesLeft <= 5
    }
  },

  methods: {
    quitLevel() {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="postcss">
.LevelInterface {
  background: linear-gradient(to bottom, rgba(black, .5), rgba(black, .0) 2rem);
}

.LevelInterface__panel {
  @apply flex items-center justify-center h-12 bg-gray-100 rounded-xl pb-1 z-1;
  box-shadow: inset 0 -4px 0 0 theme("colors.gray.400");

  @screen md {
    @apply h-16 rounded-2xl;
    box-shadow: inset 0 -6px 0 0 theme("colors.gray.400");
  }
}
</style>