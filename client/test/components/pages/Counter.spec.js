import { shallowMount } from '@vue/test-utils'
import Counter from '../../../app/components/pages/Counter.vue';

describe('Counter.vue', () => {
  it('increments count when button is clicked', () => {
    const wrapper = shallowMount(Counter)
    wrapper.find('button').trigger('click')
    expect(wrapper.find('div').text()).toMatch('1')
  })
})
