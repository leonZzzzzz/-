<template>
  <QcNavigationPage content="课程会员">
    <el-form ref="model" :model="model" label-position="left" label-width="100px" style="width:850px">
      <el-form-item
        v-if="!$route.query.id"
        label="小鹅通商品"
        prop="goodsId"
        :rules="[{ required: true, message: '请填写该字段' }]"
      >
        <el-input v-model="model.goodsId"></el-input>
        <el-button type="text" :disabled="model.goodsId == ''" @click="xiaoeTechGoodsGet()"
          >获取小鹅通数据并替换</el-button
        >
      </el-form-item>
      <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="summary" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.summary" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="icon" :rules="[{ required: true, message: '请填写该字段' }]">
        <QcImageUpload
          width="150px"
          height="150px"
          :is-prefix="!/http/.test(model.icon)"
          v-model="model.icon"
        ></QcImageUpload>
      </el-form-item>
      <!-- <el-form-item label="海报背景图" prop="posterBackground" :rules="[{ required: true, message: '请填写该字段' }]">
        <QcImageUpload
          width="150px"
          height="150px"
          :is-prefix="!/http/.test(model.posterBackground)"
          v-model="model.posterBackground"
        ></QcImageUpload>
      </el-form-item>-->
      <el-form-item label="会员详情" prop="content" :rules="[{ required: true, message: '请填写该字段' }]">
        <Editor v-model="model.content"></Editor>
      </el-form-item>
      <el-form-item
        label="商品价格"
        prop="price"
        :rules="[
          { required: true, message: '请填写该字段' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确的金额' }
        ]"
      >
        <el-input v-model="model.price"></el-input>
      </el-form-item>
      <el-form-item
        label="划线价格"
        prop="linePrice"
        :rules="[
          { required: true, message: '请填写该字段' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确的金额' }
        ]"
      >
        <el-input v-model="model.linePrice"></el-input>
      </el-form-item>
      <el-form-item
        label="推广佣金"
        prop="shareCommission"
        :rules="[
          { required: true, message: '请填写该字段' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确的金额' }
        ]"
      >
        <el-input v-model="model.shareCommission"></el-input>
      </el-form-item>
      <el-form-item label="推广积分" prop="sharePoint" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input v-model="model.sharePoint"></el-input>
      </el-form-item>
      <el-form-item label="有效天数" prop="validDays" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-select v-model="model.validDays">
          <el-option :value="7" label="七天"></el-option>
          <el-option :value="15" label="十五天"></el-option>
          <el-option :value="31" label="一个月"></el-option>
          <el-option :value="92" label="三个月"></el-option>
          <el-option :value="183" label="半年"></el-option>
          <el-option :value="366" label="一年"></el-option>
          <el-option :value="731" label="两年"></el-option>
          <el-option :value="1827" label="五年"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" prop="sortNumber" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-input-number :min="1" v-model="model.sortNumber" style="width: 216px;"></el-input-number>顺序由大到小
      </el-form-item>
      <!-- <el-form-item label="开售时间" prop="startTime">
        <el-date-picker v-model="model.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="停售时间" prop="endTime">
        <el-date-picker v-model="model.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>-->
      <el-form-item label="销售状态" prop="saleStatus" :rules="[{ required: true, message: '请填写该字段' }]">
        <el-select v-model="model.saleStatus">
          <el-option label="上架" :value="0"></el-option>
          <el-option label="下架" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSave()" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </QcNavigationPage>
</template>

<script>
import api from '../../api/course-vip'
export default {
  data() {
    return {
      model: {
        goodsId: '', //小鹅通商品id
        content: '', //内容
        name: '', //名称，用小鹅通的title
        posterBackground: '/static/post.png', //海报背景图
        icon: '', //封面图，用小鹅通的imgUrl
        price: '', //价格，用小鹅通的price
        linePrice: '',
        validDays: '', //有效天数
        saleStatus: 0, //销售状态：0=上架，1=下架
        startTime: '', //开售时间，yyyy-MM-dd HH:mm:ss
        endTime: '', //停售时间，yyyy-MM-dd HH:mm:ss
        shareCommission: '', //推广佣金
        sharePoint: '', //推广积分
        summary: '', //简介，用小鹅通的summary,
        sortNumber: ''
      }
    }
  },
  created() {
    this.$route.query.id && this.courseVipGet()
  },
  methods: {
    xiaoeTechGoodsGet() {
      api.xiaoeTechGoodsGet({ goodsId: this.model.goodsId, goodsType: 5 }).then((res) => {
        const data = res.data.data
        this.model.name = data.title
        this.model.price = data.price / 100
        this.model.linePrice = data.linePrice / 100 || 0
        this.model.icon = data.imgUrl
        // this.model.posterBackground = data.imgUrlCompressed
        this.model.posterBackground = ''
        this.model.summary = data.summary
        this.model.content = data.content
      })
    },
    courseVipGet() {
      api.courseVipGet({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
        this.model.price /= 100
        this.model.linePrice = this.model.linePrice / 100 || 0
        this.model.shareCommission /= 100
      })
    },
    courseVipAdd(model) {
      api.courseVipAdd(model).then(() => {
        this.$message.success('保存成功')
        this.$router.back()
      })
    },
    courseVipUpdate(model) {
      api.courseVipUpdate(model).then(() => {
        this.$message.success('保存成功')
        this.$router.back()
      })
    },
    onSave() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.price = parseFloat(model.price) * 100
          model.linePrice = parseFloat(model.linePrice) * 100
          model.shareCommission = parseFloat(model.shareCommission) * 100
          // model.id ? this.courseVipUpdate(model) : this.courseVipAdd(model)
          api[model.id ? 'courseVipUpdate' : 'courseVipAdd'](model).then(() => {
            this.$message.success('保存成功')
            this.$router.back()
          })
        }
      })
    }
  }
}
</script>

<style></style>
