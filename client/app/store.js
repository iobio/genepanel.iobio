import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summaryGenesFullList: [],
    summaryGenes: [],
  },
  getters: {
    getSummaryGenesFullList: state => state.summaryGenesFullList,
    getSummaryGenes: state => state.summaryGenes,
  },
  actions: {
    addSummaryGenesFullList({ commit }, genes){
      commit('summaryFullGeneList', genes)
    },
    addSummaryGenes({ commit }, genes){
      commit('summaryGeneList', genes)
    }
  },
  mutations: {
    summaryFullGeneList: (state, genes) => state.summaryGenesFullList = genes,
    summaryGeneList: (state, genes) => state.summaryGenes = genes
  }
})
