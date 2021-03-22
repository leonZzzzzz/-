<template>
  <QcNavigationPage content="修改功能管理">
    <div>
      <div v-for="(first, firstIndex) in tree" :key="firstIndex">
        <!-- 第一级 -->
        <div class="first-item">
          <el-checkbox :checked="first.value == 'checked'" v-model="first.value" @change="change($event, first.id)">{{
            first.name
          }}</el-checkbox>
        </div>
        <!-- 第二级 -->
        <div class="item-list" v-for="(second, secondIndex) in first.children" :key="secondIndex">
          <el-checkbox :checked="second.value == 'checked'" v-model="second.value" @change="change($event, second.id)">
            {{ second.name }}
          </el-checkbox>
          <div class="item-list" v-for="(third, thirdIndex) in second.children" :key="thirdIndex">
            <!-- 第三级 -->
            <el-checkbox :checked="third.value == 'checked'" v-model="third.value" @change="change($event, third.id)">
              {{ third.name }}
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      tree: []
    }
  },
  created() {
    this.abilityTree()
  },
  methods: {
    abilityTree() {
      this.$http.abilityTree({ appId: this.$route.query.id }).then((res) => {
        this.tree = res.data.data
      })
    },
    change(val, id) {
      this.$http
        .abilityTreeUpdate({
          id,
          value: val ? 'checked' : 'unchecked'
        })
        .then(() => {})
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
