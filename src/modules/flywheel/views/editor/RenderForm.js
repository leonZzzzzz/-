import mixin from '@/modules/flywheel/mixins'
import _ from 'lodash'

export default {
  mixins: [mixin],
  props: {
    formOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  render(h) {
    return h(
      'el-form',
      {
        props: {
          labelWidth: '100px',
          labelPosition: 'left',
          size: 'small'
        },
        ref: 'elForm'
      },
      this.formOptions.map((item, index) => {
        return [
          item.type &&
            h('el-form-item', { props: { label: item.label } }, [
              h(
                item.type,
                {
                  props: {
                    value: item.value,
                    ...item.props
                  },
                  on: {
                    input: value => {
                      let newFormOptions = _.cloneDeep(this.formOptions)
                      newFormOptions[index].value = value
                      console.log(newFormOptions)
                      this.$emit('update-form', newFormOptions)
                    }
                  }
                },
                item.options && [
                  item.type == 'el-select'
                    ? item.options.map(option => {
                        return [
                          h('el-option', {
                            props: {
                              label: option.label,
                              value: option.value
                            }
                          })
                        ]
                      })
                    : item.options.map(option => {
                        return [
                          h(
                            'el-radio-button',
                            {
                              props: {
                                label: option.value
                              }
                            },
                            option.label
                          )
                        ]
                      })
                ]
              ),
              item.tips && h('p', 
              {
                style: 'font-size: 12px;color: #888;line-height: 1.5;margin-top: 5px;'
              },
              item.tips)
            ])
        ]
      })
    )
  }
}
