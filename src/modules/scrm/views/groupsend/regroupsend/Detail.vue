<template>
  <!-- 详情 -->
  <div>
    <GoBack title="详情"></GoBack>
    <div class="main_content">
      <Title>基础信息</Title>
      <el-form label-width="70px" label-position="right">
        <el-form-item label="标题">{{ detailsList.name }}</el-form-item>
        <el-form-item label="状态">{{ detailsList.statusName }}</el-form-item>
        <el-form-item label="类型">{{ detailsList.chatTypeName }}</el-form-item>
        <el-form-item label="内容">{{ detailsList.message }}</el-form-item>
        <el-form-item label="附件" v-if="enclosureList.type != 'text'">
          <div class="image" v-if="enclosureList.type == 'image'">
            <el-image
              style="width: 100px; height: 100px"
              :src="imgHost + enclosureList.imageUrl"
              :preview-src-list="[imgHost + enclosureList.imageUrl]"
            >
            </el-image>
          </div>
          <div class="program" v-if="enclosureList.type == 'program'">
            <el-card shadow="never" :body-style="{ padding: '10px' }">
              <div class="programInfoContent">
                <div class="logo">
                  <el-avatar
                    size="medium"
                    :src="enclosureList.imageUrl ? imgHost + enclosureList.imageUrl : ''"
                  ></el-avatar>
                </div>
                <div class="name">{{ enclosureList.name }}</div>
              </div>
            </el-card>
          </div>
          <div class="image_text" v-if="enclosureList.type == 'image_text'">
            <el-card shadow="never" :body-style="{ padding: '10px' }">
              <div class="imageTextcontent">
                <div class="title">{{ enclosureList.name }}</div>
                <div class="content">{{ enclosureList.content }}</div>
                <div class="imageUrl">
                  <el-image
                    style="width: 100%"
                    :src="imgHost + enclosureList.imageUrl"
                    :preview-src-list="[imgHost + enclosureList.imageUrl]"
                  >
                  </el-image>
                </div>
              </div>
            </el-card>
          </div>
        </el-form-item>
        <el-form-item label="群发时间">{{ detailsList.sendTime | allTableTimefilters }}</el-form-item>
        <el-form-item label="创建时间">{{ detailsList.createTime | allTableTimefilters }}</el-form-item>
      </el-form>
      <Title>综合数据</Title>
      <div class="compre">
        <Card class="compre_card" title="送达客户">{{ detailsList.sendSuccessQuantity || 0 }} </Card>
        <Card class="compre_card" title="未送达客户">{{ detailsList.leftSendQuantity }}</Card>
        <Card class="compre_card" title="送达率">{{ detailsList.sendSuccessRate * 100 }}%</Card>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import Title from '../../../components/components/Title.vue'
import Card from '../../../components/components/Card.vue'
export default {
  components: {
    GoBack,
    Title,
    Card
  },
  data() {
    return {
      // 详情数据
      detailsList: {},
      // 附件数据
      enclosureList: {
        type: 'text'
      }
    }
  },
  methods: {
    // ---获取数据函数---
    // 获取详情
    groupGet() {
      this.functions('groupGet', { id: this.$route.query.id }, (res) => {
        console.log(res)
        this.detailsList = res.data.data
        this.enclosureList = res.data.data.messageItemList[0] || { type: 'text' }
      })
    }
  },
  created() {
    this.groupGet()
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  background-color: #fff;
  padding: 20px;
}
.program {
  width: 300px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    .deleteBtn {
      width: 42px;
      margin-left: auto;
      padding-left: 5px;
      display: none;
    }
    &:hover {
      .deleteBtn {
        display: block;
      }
    }
  }
}
.image_text {
  width: 300px;
  .title,
  .content {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content {
    font-size: 12px;
  }
}
.compre {
  display: flex;
  flex-wrap: wrap;
  .compre_card {
    margin-right: 10px;
  }
}
</style>
