<template>
  <el-cascader ref="cascader" :props="props" @change="onChange" :placeholder="placeholder"></el-cascader>
</template>

<script>
// TODO: 问题有点多
export default {
  props: {
    placeholder: String,
    value: [String, Array],
    type: {
      type: Number,
      default: 2
    }
  },
  data() {
    let _this = this
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          _this.getAreaList(node, resolve)
        }
      }
    }
  },
  methods: {
    getAreaList(node, resolve) {
      if (node.level == 0) {
        this.areaListByType(node, resolve, 1)
      } else {
        this.areaListByParentId(node, resolve, node.data.value)
      }
    },
    areaListByType(node, resolve, type) {
      this.$http.areaListByType({ type, pageSize: 100 }).then((res) => {
        const nodes = res.data.data.list.map((item) => ({
          value: item.id,
          label: item.name,
          leaf: item.hasChild ? node.level >= this.type : true
        }))
        resolve(nodes)
      })
    },
    areaListByParentId(node, resolve, parentId) {
      this.$http.areaListByParentId({ parentId, pageSize: 100 }).then((res) => {
        const nodes = res.data.data.list.map((item) => ({
          value: item.id,
          label: item.name,
          leaf: item.hasChild ? node.level >= this.type : true
        }))
        resolve(nodes)
      })
    },
    onChange(v) {
      this.$emit('input', v)
      setTimeout(() => {
        this.$emit('change', this.$refs.cascader.inputValue.split('/'))
      }, 100)
    }
  }
}
</script>

<style></style>
