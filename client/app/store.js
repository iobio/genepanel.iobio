import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    summaryGenesFullList: [],
    summaryGenes: [],
    gtrGenes: [],
    phenolyzerGenes: [],
  },
  getters: {
    getSummaryGenesFullList: state => state.summaryGenesFullList,
    getSummaryGenes: state => state.summaryGenes,
    getGtrGenes: state => state.gtrGenes,
    getPhenolyzerGenes: state => state.phenolyzerGenes,
  },
  actions: {
    addSummaryGenesFullList({ commit }, genes){
      commit('summaryFullGeneList', genes)
    },
    addSummaryGenes({ commit }, genes){
      commit('summaryGeneList', genes)
    },
    addGtrGenes({ commit }, genes){
      commit('gtrGeneList', genes)
    },
    addPhenolyzerGenes({ commit }, genes){
      commit('phenolyzerGeneList', genes)
    },
  },
  mutations: {
    summaryFullGeneList: (state, genes) => state.summaryGenesFullList = genes,
    summaryGeneList: (state, genes) => state.summaryGenes = genes,
    gtrGeneList: (state, genes) => state.gtrGenes = genes,
    phenolyzerGeneList: (state, genes) => state.phenolyzerGenes = genes,
  }
})
