<template>
  <el-dialog :visible="visible" append-to-body title="关联商详情" width="600px" :show-close="false">
    <QcTable v-if="visible" ref="table" :option="option" :column="column" @select="onSelect"></QcTable>
    <span slot="footer">
      <el-button @click="onClose">关闭</el-button>
      <el-button @click="onSave" type="danger">删除</el-button>
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
        url: ''
      },
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
          label: '添加时间',
          prop: 'createTime',
          align: 'center',
          width: '150px'
        }
      ],
      model: {
        objectIdList: []
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.option.url = `api/admin/mall/v1/person-ip-product/page?personIpId=${this.personId}`
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
      this.$http.deletePersonProduct(this.model).then(() => {
        this.$message.success('保存成功')
        this.onClose()
      })
    }
  }
}
</script>

<style></style>
