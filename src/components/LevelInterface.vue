<template>
  <div class="LevelInterface">
    <div class="absolute top-0 flex w-full md:w-auto align-center text-gray-700 lg:mt-10 space-x-3 lg:space-x-5 pt-5 px-5">
      <div class="LevelView__panel px-0 w-16">
        <div class="text-center leading-none">
          <div class="text-2xl mb-1" :class="{'text-red-500': isLowOnMovesLeft}">{{ movesLeft }}</div>
          <div class="uppercase text-xs font-normal">Moves</div>
        </div>
      </div>

      <div class="LevelView__panel flex-auto lg:flex-none px-2 lg:px-5">
        <div v-for="(goal, $index) in level.goals" :key="$index">
          <GoalItem :goal="goal" :theme="level.theme" show-current small />
        </div>
      </div>

      <div class="LevelView__panel px-0 w-16 cursor-pointer hover:bg-gray-200" @click="quitLevel()">
        <Icon name="map" size="lg" />
      </div>
    </div>

    <div class="absolute bottom-0 flex w-full md:w-auto text-gray-700 lg:mb-10 px-5 pb-5">
      <div class="LevelView__panel w-32 mx-auto">
        <div class="text-center leading-none">
          <div class="uppercase text-xs font-normal mb-1">Score</div>
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
    level: {
      type: Object,
      required: true
    },

    lives: {
      type: Number,
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