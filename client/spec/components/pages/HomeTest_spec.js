///Users/adityaekawade/Desktop/genepanel/client/app/components/pages/HomeTest.vue


// import { mount } from '@vue/test-utils'
// import { shallow } from '@vue/test-utils'
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
// chai.use(require('sinon-chai'));

import HomeTest from '../../../app/components/pages/HomeTest.vue';
import Gtr from '../../../app/components/pages/Gtr.vue'


describe('Home page component', () => {
  it('sets a hello world greeting', () => {
    let wrapper = mount(HomeTest);
    expect(wrapper.vm.greeting).to.equal('hello world!');
  });
  it('sets a singing song task', () => {
    let wrapper = mount(HomeTest);
    expect(wrapper.vm.doSomething).to.equal('sing a song');
  });
  it('count ', ()=>{
    let wrapper = mount(HomeTest);
    expect(wrapper.vm.count).to.equal(0);
  })

});



describe('Counter', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(HomeTest)

  it('renders the correct markup', () => {
    expect(wrapper.html()).contain('<span class="count">0</span>')
  })

  // it('renders the correct markup', () => {
  //   expect(wrapper.html()).toContain('<span class="count">0</span>')
  // })

  it('has a button', () => {
    expect(wrapper.contains('button')).to.equal(true)
  })

  it('button should increment the count', () => {
    expect(wrapper.vm.count).to.equal(0)
    const button = wrapper.find('button')
    button.trigger('click')
    //expect(wrapper.vm.count).to(1)
    expect(wrapper.vm.count).to.equal(1)
  })
})


describe('GTR', () => {
  const wrapper = mount(Gtr)
  it('has a button', () => {
    expect(wrapper.contains('button')).to.equal(true)
  })
})
