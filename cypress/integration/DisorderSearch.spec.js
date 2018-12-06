// const mountVue = require('cypress-vue-unit-test')
// import DisorderSearch from '../../client/app/components/pages/Main.vue';
//
// describe('DisorderSearch', ()=>{
//   beforeEach(mountVue(DisorderSearch));
//
//   // describe('clicking search box', ()=>{
//   //   it('type in search box', ()=>{
//   //     cy.get("#input").type('Treacher Collins syndrome');
//   //   })
//   // })
// })

const mountVue = require('cypress-vue-unit-test')
import Temp from '../Temp.vue'
/* eslint-env mocha */
describe('Declarative rendering', () => {
  // Vue code from https://vuejs.org/v2/guide/#Declarative-Rendering
  beforeEach(mountVue(Temp))

  it('shows hello', () => {
    cy.contains('Hello Vue!')
  })

  it('changes message if data changes', () => {
    // mounted Vue instance is available under Cypress.vue
    Cypress.vue.message = 'Vue rocks!'
    cy.contains('Vue rocks!')
  })
})
