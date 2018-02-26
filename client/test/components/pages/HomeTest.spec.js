import { shallow } from '@vue/test-utils';
import HomeTest from '../../../app/components/pages/HomeTest.vue';

import Gtr from '../../../app/components/pages/Gtr.vue'


describe('Home', () => {

  it('sets a greeting', () => {
    let wrapper = shallow(HomeTest);
    expect(wrapper.vm.greeting).to.equal('hello world!')
  });

});


describe('GTR', () => {
  const wrapper = shallow(Gtr)
  it('has a button', () => {
    expect(wrapper.contains('button')).to.equal(true)
  });
})
