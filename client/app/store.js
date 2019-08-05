import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summaryGenesFullList: [],
  },
  getters: {
    getSummaryGenesFullList: state => state.summaryGenesFullList
  },
  actions: {
    addSummaryGenesFullList({ commit }, genes){
      commit('summaryFullGeneList', genes)
    }
  },
  mutations: {
    summaryFullGeneList: (state, genes) => state.summaryGenesFullList = genes,
  }
})
