<template>
  <el-cascader :value="position" :options="address" :props="props" filterable @change="onChange"></el-cascader>
</template>

<script>
// import address from './address'
// 与小程序城市数据保持一致
import regionData from './data'
export default {
  props: {
    value: Array,
    type: String
  },
  data() {
    return {
      address: [],
      props: {
        checkStrictly: true,
        value: 'label',
        label: 'label'
      },
      position: []
    }
  },
  created() {
    this.position = JSON.parse(JSON.stringify(this.value))
    let list = []
    for (let key in regionData.province_list) {
      let item = regionData.province_list[key]
      let cityList = this.getAreaList('city', key.slice(0, 2))
      let areaList = []
      list.push({
        label: item,
        value: key,
        children: cityList.map((cityItem) => {
          areaList = this.getAreaList('area', cityItem.code.slice(0, 4))
          return {
            label: cityItem.name,
            value: cityItem.code,
            children: areaList.map((areaItem) => {
              return {
                label: areaItem.name,
                value: areaItem.code
              }
            })
          }
        })
      })
    }
    // console.log(list)
    this.address = list

    if (this.type === 'city') {
      let address = JSON.parse(JSON.stringify(this.address))
      this.address = address.map((province) => {
        if (province.children) {
          province.children.map((city) => {
            delete city.children
          })
        }
        return province
      })
    }
  },
  watch: {
    value(v) {
      this.position = JSON.parse(JSON.stringify(v))
    }
  },
  methods: {
    getAreaList(type, code) {
      let result = []
      if (type !== 'province' && !code) {
        return result
      }
      const list = regionData[`${type}_list`]
      result = Object.keys(list).map((code) => ({
        code,
        name: list[code]
      }))
      if (code) {
        result = result.filter((item) => item.code.indexOf(code) === 0)
      }
      return result
    },
    onChange(v) {
      console.log(v)
      this.$emit('input', v)
    }
  }
}
</script>

<style></style>
