<template>
  <QcNavigationPage content="修改应用权限">
    <div>
      <div v-for="(first, firstIndex) in tree" :key="firstIndex">
        <!-- 第一级 -->
        <div class="first-item">
          <el-checkbox v-model="first.checked" @change="change($event, 0, firstIndex)">{{ first.name }}</el-checkbox>
          <!-- {{first.id}} -->
        </div>
        <!-- 第二级 -->
        <div class="item-list" v-for="(second, secondIndex) in first.childs" :key="secondIndex">
          <el-checkbox v-model="second.checked" @change="change($event, 1, firstIndex, secondIndex)">{{
            second.name
          }}</el-checkbox>
          <!-- {{second.id}} -->
          <div class="item-list" v-for="(third, thirdIndex) in second.childs" :key="thirdIndex">
            <!-- 第三级 -->
            <el-checkbox v-model="third.checked" @change="change($event, 2, firstIndex, secondIndex, thirdIndex)">{{
              third.name
            }}</el-checkbox>
            <!-- {{third.id}} -->
            <div class="item-list">
              <div
                style="display:inline-block;margin-right:25px"
                v-for="(fourth, fourthIndex) in third.childs"
                :key="fourthIndex"
              >
                <!-- 第四级 -->
                <el-checkbox
                  v-model="fourth.checked"
                  @change="change($event, 3, firstIndex, secondIndex, thirdIndex, fourthIndex)"
                  >{{ fourth.name }}</el-checkbox
                >
                <!-- {{fourth.id}} -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" size="small" @click="onSubmit()" :loading="loading">保存</el-button>
    </div>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      tree: [],
      loading: false
    }
  },
  created() {
    this.permissionTree()
  },
  methods: {
    permissionTree() {
      this.$http.permissionTreeForApp({ appId: this.$route.query.id }).then((res) => {
        this.tree = res.data.data
      })
    },
    appPermissionAssociate(permissionIdList) {
      this.loading = true
      this.$http
        .appPermissionAssociate({
          appId: this.$route.query.id,
          permissionIdList: permissionIdList
        })
        .then((res) => {
          console.log(res.data)
          this.loading = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    change(val, level, firstIndex, secondIndex, thirdIndex) {
      switch (level) {
        case 0:
          this.updateTreeChild(this.tree[firstIndex].childs, val)
          break
        case 1:
          if (val) {
            this.tree[firstIndex].checked = val
          }
          this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs, val)
          break
        case 2:
          if (val) {
            this.tree[firstIndex].checked = val
            this.tree[firstIndex].childs[secondIndex].checked = val
          }
          this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs[thirdIndex].childs, val)
          break
        case 3:
          if (val) {
            this.tree[firstIndex].checked = val
            this.tree[firstIndex].childs[secondIndex].checked = val
            this.tree[firstIndex].childs[secondIndex].childs[thirdIndex].checked = val
          }
          break
      }
    },
    updateTreeChild(data, flag) {
      data.forEach((item) => {
        item.checked = flag
        Array.isArray(item.childs) && this.updateTreeChild(item.childs, flag)
      })
    },
    loop(data, ids = []) {
      let array = ids
      data.forEach((item) => {
        if (item.checked) {
          array.push(item.id)
          Array.isArray(item.childs) && this.loop(item.childs, array)
        }
      })
      return array
    },
    onSubmit() {
      let permissionIdList = this.loop(this.tree).join(',')
      !permissionIdList ? this.$message.error('请勾选权限') : this.appPermissionAssociate(permissionIdList)
    }
  }
}
</script>

<style lang="scss" scoped>
.first-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}
.item-list {
  padding: 10px 0;
  margin-left: 25px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
