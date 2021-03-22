<template>
  <!-- 标签编辑 个人标签 企业标签 行为标签 xfo-->
  <!-- 
      type 类型  企业(company) 个人(personal) 行为(behavior)
   -->

  <div>
    <Dialog :configure="configure" height="300px" @closeDialog="closeDialog" @success="success">
      <div class="xfo-tag" v-loading="isLoading">
        <!-- 企业标签 行为标签 -->
        <div v-if="type == 'company' || type == 'behavior'">
          <div class="xfo-tag-group" v-for="(group, gIndex) in tagsData" :key="gIndex">
            <div class="xfo-tag-title">{{ group.name }}</div>
            <div class="xfo-tag-content">
              <el-button
                class="xfo-tag-item"
                v-for="(item, index) in group.tagList"
                :key="index"
                :type="item.selected ? 'primary' : ''"
                :plain="!item.selected"
                size="mini"
                @click="selectedTags(item, gIndex, index)"
                >{{ item.name }}</el-button
              >
            </div>
          </div>
        </div>
        <!-- 个人标签 -->
        <div v-if="type == 'personal'">
          <div class="xfo-tag-group">
            <div class="xfo-tag-content">
              <el-button
                class="xfo-tag-item"
                v-for="(item, index) in tagsData"
                :key="index"
                :type="item.selected ? 'primary' : ''"
                :plain="!item.selected"
                size="mini"
                @click="selectedTags(item, index, 0)"
                >{{ item.name }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './Dialog'
const config = {
  title: '企业标签',
  visible: false,
  width: '600px',
  top: '15vh'
}
export default {
  props: {
    configure: {
      type: Object,
      default: () => {
        return config
      }
    },
    height: {
      type: String,
      default: '500px'
    },
    type: {
      type: String,
      default: 'company'
    },
    id: {
      type: String,
      default: ''
    },
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Dialog
  },
  watch: {
    type() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  data() {
    return {
      tagsData: [],
      selectedData: [],
      isLoading: false
    }
  },
  methods: {
    // ---页面渲染---
    // 获取数据
    getData() {
      this.tagsData = []
      this.selectedData = []
      this.isLoading = false
      new Promise(async (resolve, reject) => {
        if (this.type == 'company') {
          await this.getEnterpriseTagPage()
        }
        if (this.type == 'behavior') {
          await this.getBehaviorTagPage()
        }
        if (this.type == 'personal') {
          console.log('aaaa')
          await this.getPersonalTagPage()
        }
        resolve(true)
      }).then((res) => {
        this.selectedData = this.selectedList.concat()
        if (this.selectedList.length == 0) {
          return
        }
        if (this.type == 'company' || this.type == 'behavior') {
          this.selectedList.forEach((sItem, sIndex) => {
            this.tagsData.forEach((group, gIndex) => {
              group.tagList.forEach((item, index) => {
                if (sItem.id == item.id) {
                  this.tagsData[gIndex].tagList[index].selected = true
                }
              })
            })
          })
        }
        if (this.type == 'personal') {
          console.log('aaaaaaaaaaaa')
          this.selectedList.forEach((sItem, sIndex) => {
            this.tagsData.forEach((group, gIndex) => {
              if (sItem.id == group.id) {
                this.tagsData[gIndex].selected = true
              }
            })
          })
        }
      })
    },
    // 对话框
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    success() {
      this.$emit('success', this.selectedData)
    },
    // 选择与取消标签
    selectedTags(item, gIndex, index) {
      if (this.selectedData.length > 0) {
        for (var i = 0; i < this.selectedData.length; i++) {
          if (this.selectedData[i].id == item.id) {
            this.selectedData.splice(i, 1)
            item.selected = false
            if (this.type == 'company' || this.type == 'behavior') {
              this.tagsData[gIndex].tagList[index].selected = false
            }
            if (this.type == 'personal') {
              this.tagsData[gIndex].selected = false
            }
            return
          }
        }
      }
      this.selectedData.push(item)
      if (this.type == 'company' || this.type == 'behavior') {
        this.tagsData[gIndex].tagList[index].selected = true
      }
      if (this.type == 'personal') {
        this.tagsData[gIndex].selected = true
      }
    },
    // ---获取数据---
    // 企业标签
    getEnterpriseTagPage() {
      this.configure.title = '企业标签'
      return new Promise((resolve, reject) => {
        this.tagsData = []
        this.isLoading = true
        this.$http
          .getEnterpriseTagPage()
          .then((res) => {
            console.log('企业标签', res)
            this.tagsData = res.data.data.list
            this.tagsData.forEach((group) => {
              group.tagList.forEach((item) => {
                this.$set(item, 'selected', false)
              })
            })
            this.isLoading = false
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 行为标签
    getBehaviorTagPage() {
      this.configure.title = '行为标签'
      return new Promise((resolve, reject) => {
        this.tagsData = []
        this.isLoading = true
        this.$http
          .getBehaviorTagPage()
          .then((res) => {
            console.log('行为标签', res)
            this.tagsData = res.data.data.list
            this.tagsData.forEach((group) => {
              group.tagList.forEach((item) => {
                this.$set(item, 'selected', false)
              })
            })
            this.isLoading = false
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 个人标签
    getPersonalTagPage() {
      this.configure.title = '个人标签'
      return new Promise((resolve, reject) => {
        this.tagsData = []
        this.$http
          .getPersonalTagPage()
          .then((res) => {
            console.log('个人标签', res)
            this.tagsData = res.data.data.list
            this.tagsData.forEach((item) => {
              this.$set(item, 'selected', false)
            })
            this.isLoading = false
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-tag {
  .xfo-tag-group {
    .xfo-tag-title {
      font-size: 14px;
      color: #909399;
      margin-bottom: 20px;
      padding-left: 20px;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 14px;
        background-color: #294a7b;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        left: 0;
      }
    }
    .xfo-tag-content {
      padding-bottom: 10px;
      .xfo-tag-item {
        margin: 0 10px 10px 0;
      }
    }
  }
}
</style>
