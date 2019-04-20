import { mount } from '@vue/test-utils'
import Image from './Image'

describe('Image', () => {
  describe('component', () => {
    test('should be a Vue instance', async () => {
      const wrapper = await mount(Image)
      expect(wrapper.isVueInstance()).toBeTruthy()
    })
  })

  describe('props', () => {
    test('should render without props', async () => {
      const wrapper = await mount(Image)
      expect(wrapper.element).toMatchSnapshot()
    })

    const props = [
      {
        prop: 'url',
        value: 'http://foo.bar'
      },
      {
        prop: 'alt',
        value: 'alternative title'
      },
      {
        prop: 'color',
        value: '#fff'
      }
    ]

    props.forEach(({ prop, value }) => {
      test(`should render with prop ${prop}`, async () => {
        const wrapper = await mount(Image, {
          propsData: {
            [prop]: value
          }
        })

        expect(wrapper.element).toMatchSnapshot()
      })
    })
  })
})
