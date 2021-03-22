<template>
  <div class="block" :style="{ 'padding-bottom': options.styleType == 2 ? '10px' : '0' }">
    <div class="qc-menus" :class="[options.column, { 'qc-menus-style2': options.styleType == 2 }]">
      <div v-if="options.styleType != 2">
        <div class="qc-menu" v-for="(item, index) in options.item" :key="index">
          <el-image :src="imgHost + item.iconUrl" style="width:50px;height:50px" />
          <p class="text" v-if="options.hasText">{{ item.name }}</p>
        </div>
      </div>
      <div v-else style="display: flex;width: 100%;">
        <div
          class="qc-menu-group__box"
          :class="{ 'qc-menu-group__box--single': options.row.includes('1') }"
          v-for="(label, index) in list"
          :key="label[index] ? label[index].vueKey : index"
        >
          <div class="qc-menu" v-for="item in label" :key="item.iconUrl">
            <el-image :src="imgHost + item.iconUrl" style="width:50px;height:50px" />
            <p class="text" v-if="options.hasText">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QcMenuWrap',
  title: '功能按钮',
  props: {
    options: Object
  },
  config: [
    {
      formName: 'hasText',
      label: '显示文本',
      type: 'el-switch',
      value: true
    },
    {
      formName: 'styleType',
      label: '选择样式',
      type: 'el-select',
      value: 1,
      options: [
        {
          value: 1,
          label: '默认样式'
        },
        {
          value: 2,
          label: '样式二'
        }
      ]
    },
    {
      formName: 'column',
      label: '每行列数',
      type: 'el-select',
      value: 'qc-menus--w4',
      options: [
        {
          value: 'qc-menus--w4',
          label: '四个'
        },
        {
          value: 'qc-menus--w5',
          label: '五个'
        }
      ]
    },
    {
      formName: 'row',
      label: '显示行数(仅样式二时有效)',
      type: 'el-select',
      value: 'qc-menus--r2',
      options: [
        {
          value: 'qc-menus--r1',
          label: '一行'
        },
        {
          value: 'qc-menus--r2',
          label: '两行'
        }
      ]
    },
    {
      formName: 'item',
      label: '数据源',
      type: 'qc-uploader',
      value: [
        {
          url: '',
          text: '文本',
          img: ''
        }
      ]
    }
  ],
  data() {
    return {
      // list: []
    }
  },
  watch: {
    'options.styleType'(val) {
      // this.setList(val)
    }
  },
  computed: {
    list() {
      let val = this.options.styleType
      let arr = this.options.item || [],
        arr2 = []

      // 按指定大小将一个数组切割成多个数组,最多2排
      if (val == 2 && this.options.item) {
        if (this.options.row.includes('1')) {
          // 单排
          arr2 = [this.options.item]
        } else {
          // 两排
          if (this.options.column.includes('4')) {
            //一排4个
            for (var i = 0; i < arr.length; i = i + 8) {
              arr2.push(arr.slice(i, i + 8))
            }
          } else if (this.options.column.includes('5')) {
            //一排5个
            for (var i = 0; i < arr.length; i = i + 10) {
              arr2.push(arr.slice(i, i + 10))
            }
          }
        }
      }
      arr2.map((label) => {
        label.map((item, i) => {
          item.vueKey = i
        })
      })
      console.log(arr2)
      return arr2
    }
  },
  mounted() {
    // if (this.options && this.options.styleType) this.setList(this.options.styleType);
  },
  methods: {
    setList(val) {
      let arr = this.options.item || [],
        arr2 = []
      // 按指定大小将一个数组切割成多个数组,最多2排
      if (val == 2 && this.options.item) {
        if (this.options.row.includes('1')) {
          // 单排
          arr2 = [this.options.item]
        } else {
          // 两排
          if (this.options.column.includes('4')) {
            //一排4个
            for (var i = 0; i < arr.length; i = i + 8) {
              arr2.push(arr.slice(i, i + 8))
            }
          } else if (this.options.column.includes('5')) {
            //一排5个
            for (var i = 0; i < arr.length; i = i + 10) {
              arr2.push(arr.slice(i, i + 10))
            }
          }
        }
      }
      this.list = arr2
      // return arr2
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  background: #f6f6f6;
}

.qc-menus,
.qc-menus-style2 {
  overflow: hidden;
  background: #fff;
  .qc-menu {
    float: left;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
    .text {
      font-size: 14px;
      height: 18px;
      line-height: 18px;
      overflow: hidden;
    }
  }
  &.qc-menus--w2 {
    .qc-menu {
      width: 50%;
    }
  }
  &.qc-menus--w3 {
    .qc-menu {
      width: 33.33%;
    }
  }
  &.qc-menus--w4 {
    .qc-menu {
      width: 25%;
    }
  }
  &.qc-menus--w5 {
    .qc-menu {
      width: 20%;
    }
  }
}

.qc-menus-style2 {
  overflow: auto;
  display: flex;
  flex-wrap: initial;
  margin: 0 10px;
  padding: 0 10px; // margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 5px 5px 0 #eee;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  overflow-x: hidden;
  .qc-menu-group__box {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    flex-shrink: 0;
    max-width: 100%;
    width: 100%;
  }
  .qc-menu-group__box--single {
    overflow: auto;
    flex-wrap: initial;
    width: 100%;
  }
  .qc-menus--r1 {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
