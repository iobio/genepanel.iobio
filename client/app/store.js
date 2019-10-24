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
    phenolyzerStatusGlobal: null,
  },
  getters: {
    getSummaryGenesFullList: state => state.summaryGenesFullList,
    getSummaryGenes: state => state.summaryGenes,
    getGtrGenes: state => state.gtrGenes,
    getPhenolyzerGenes: state => state.phenolyzerGenes,
    getPhenolyzerStatusGlobal: state => state.phenolyzerStatusGlobal,
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
    updatePhenolyzerStatusGlobal({ commit }, status){
      commit('phenolyzerStatus', status)
    }
  },
  mutations: {
    summaryFullGeneList: (state, genes) => state.summaryGenesFullList = genes,
    summaryGeneList: (state, genes) => state.summaryGenes = genes,
    gtrGeneList: (state, genes) => state.gtrGenes = genes,
    phenolyzerGeneList: (state, genes) => state.phenolyzerGenes = genes,
    phenolyzerStatus: (state, status) => state.phenolyzerStatusGlobal = status,
  }
})
