<template>
  <el-dialog :visible="visible" append-to-body title="关联商品" width="1000px" :show-close="false">
    <QcTable
      v-if="visible"
      ref="table"
      :option="option"
      :search-form="searchForm"
      :column="column"
      @select="onSelect"
    ></QcTable>
    <span slot="footer">
      <el-button @click="onClose">关闭</el-button>
      <el-button @click="onSave" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personId: String
  },
  data() {
    return {
      option: {
        height: '500px',
        url: 'api/admin/mall/v1/product/page'
      },
      searchForm: [{ label: '商品名称', type: 'input', formName: 'name' }],
      column: [
        {
          type: 'selection'
        },
        {
          label: '商品',
          prop: 'name'
        },
        {
          label: '价格',
          formatter: (row) => {
            return row.price / 100
          }
        },
        {
          label: '品牌',
          prop: 'brandName',
          align: 'center',
          width: '150px'
        },
        {
          label: '分类',
          prop: 'categoryName',
          align: 'center',
          width: '150px'
        },
        {
          label: '状态',
          prop: 'isSell',
          align: 'center',
          formatter: (row) => {
            return row.isSell ? '上架' : '下架'
          },
          width: '150px'
        }
      ],
      selectRow: [],
      model: {
        objectIdList: [],
        objectType: 'product'
      }
    }
  },
  methods: {
    onSelect(row) {
      this.model.objectIdList = []
      row.forEach((item) => {
        this.model.objectIdList.push(item.id)
      })
    },
    onClose() {
      this.$emit('close')
    },
    onSave() {
      this.model.personIpId = this.personId
      this.$http.addPersonProduct(this.model).then(() => {
        this.$message.success('保存成功')
        this.onClose()
      })
    }
  }
}
</script>

<style></style>
