import { shallowMount } from '@vue/test-utils';
import HomeTest from '../../../app/components/pages/HomeTest.vue';

// import Gtr from '../../../app/components/pages/Gtr.vue'


describe('Home', () => {

  it('sets a greeting', () => {
    let wrapper = shallowMount(HomeTest);
    expect(wrapper.vm.greeting).toBe('hello world!')
  });

});


// describe('GTR', () => {
//   const wrapper = shallow(Gtr)
//   it('has a button', () => {
//     expect(wrapper.contains('button')).to.equal(true)
//   });
// })
