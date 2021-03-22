<template>
  <div>
    <el-tag
      v-for="(item, index) in value"
      :key="item.name"
      style="margin: 0 10px 10px 0;"
      disable-transitions
      closable
      @close="onClose(index)"
      >{{ item.name }}</el-tag
    >
    <el-button @click="visible = true" icon="el-icon-plus" type="primary" size="mini">添加</el-button>
    <el-dialog
      width="600px"
      :before-close="
        () => {
          visible = false
        }
      "
      :visible="visible"
      title="选择分类"
      close-on-click-modal
      append-to-body
    >
      <QcTable v-if="isReady" ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    type: {
      type: [Number, String],
      default: ''
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isReady: false,
      visible: false,
      option: {
        url: 'api/admin/v1/category/page',
        isFull: false
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        { formName: 'type', value: this.type }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '简介', prop: 'info', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.onSelect.bind(this, row)}>
                  使用
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.type === 1) {
          this.isReady = true
        } else {
          this.treeCategory()
        }
      } else {
        this.isReady = false
      }
    }
  },
  computed: {
    newValue() {
      return _.cloneDeep(this.value)
    }
  },
  methods: {
    treeCategory() {
      this.$http.treeCategory({ type: this.type }).then((res) => {
        this.searchForm.push({ formName: 'parentId', value: res.data.data[0].id })
        this.isReady = true
      })
    },
    onClose(index) {
      this.newValue.splice(index, 1)
      this.$emit('input', this.newValue)
    },
    onSelect(category) {
      const exist = this.newValue.find((item) => {
        if (item.id == category.id) {
          return item
        }
      })
      if (!exist) {
        this.newValue.push({ name: category.name, id: category.id })
        this.visible = false
        this.$emit('input', this.newValue)
      } else {
        this.$message.warning('该分类已存在，请勿重复添加！')
      }
    }
  }
}
</script>
