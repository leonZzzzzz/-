<template>
  <QcNavigationPage content="编辑权限">
    <div>
      <div v-for="(first, firstIndex) in tree" :key="firstIndex">
        <!-- 第一级 -->
        <div class="first-item">
          <el-checkbox v-model="first.checked" @change="change($event, 0, firstIndex)">{{ first.name }}</el-checkbox>
        </div>
        <!-- 第二级 -->
        <div class="item-list" v-for="(second, secondIndex) in first.childs" :key="secondIndex">
          <el-checkbox v-model="second.checked" @change="change($event, 1, firstIndex, secondIndex)">{{
            second.name
          }}</el-checkbox>
          <div class="item-list" v-for="(third, thirdIndex) in second.childs" :key="thirdIndex">
            <!-- 第三级 -->
            <el-checkbox v-model="third.checked" @change="change($event, 2, firstIndex, secondIndex, thirdIndex)">{{
              third.name
            }}</el-checkbox>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="onSubmit()" style="margin-right: 30px;" size="small" :loading="loading"
        >保存</el-button
      >
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
    this.appPricingElementTree()
  },
  methods: {
    appPricingElementTree() {
      this.$http.appPricingElementTree({ id: this.$route.query.id }).then((res) => {
        this.tree = res.data.data
        this.dataLoading = false
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
        item.childs instanceof Array && this.updateTreeChild(item.childs, flag)
      })
    },
    loop(data, ids = []) {
      let array = ids
      data.forEach((item) => {
        if (item.checked) {
          array.push(item.id)
          item.childs instanceof Array && this.loop(item.childs, array)
        }
      })
      return array
    },
    onSubmit() {
      let pricingElePermList = []
      this.loop(this.tree).map((item) => {
        pricingElePermList.push({
          permissionId: item
        })
      })
      !pricingElePermList ? this.$message.error('请勾选权限') : this.bindPermissionPricingElement(pricingElePermList)
    },
    bindPermissionPricingElement(pricingElePermList) {
      this.loading = true
      this.$http
        .bindPermissionPricingElement({
          id: this.$route.query.id,
          pricingElePermList
        })
        .then(() => {
          this.loading = false
          this.$message.success('修改成功')
        })
        .catch(() => {
          this.loading = false
        })
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
