import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const TYPES = {
  LEVEL_COMPLETED: 'LEVEL_COMPLETED'
}

const state = {
  user: JSON.parse(localStorage.getItem('user') || null) || {
    name: 'player',
    level: 1,
    scoreByLevel: {}
  }
}

const actions = {
  completeLevel({ commit, dispatch }, { level, score }) {
    commit(TYPES.LEVEL_COMPLETED, { level, score })
    dispatch('persist')
  },

  persist({ state }) {
    localStorage.setItem('user', JSON.stringify(state.user))
  }
}

const mutations = {
  [TYPES.LEVEL_COMPLETED](state, { level, score }) {
    const userLevel = state.user.level === level
      ? state.user.level + 1
      : state.user.level

    state.user = {
      ...state.user,
      level: userLevel,
      scoreByLevel: {
        ...state.user.scoreByLevel,
        [level]: score
      }
    }
  }
}

const getters = {
  user(state) {
    return {
      ...state.user,
      totalScore: Object.values(state.user.scoreByLevel).reduce((sum, score) => sum + score, 0)
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
