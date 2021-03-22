<template>
  <el-dialog append-to-body title="添加自定义参数" width="400px" :visible="visible" :show-close="false">
    <el-form ref="model" :model="model" label-position="left" label-width="94px">
      <el-form-item label="类型">
        <el-select v-model="type" style="width:236px">
          <el-option label="活动" :value="2"></el-option>
          <el-option label="商品" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <p style="font-size: 15px;margin-bottom: 18px;color:#7d7d7d">系统参数</p>
      <el-form-item label="分类">
        <el-select v-model="model.categoryId" style="width:236px">
          <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <p style="font-size: 15px;margin-bottom: 18px;color:#7d7d7d">自定义参数</p>
      <div>
        <el-row :gutter="10" style="margin-bottom: 10px;">
          <el-col :span="6">字段名</el-col>
          <el-col :span="17">参数</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item, index) in model.customParams" :key="index">
          <el-col :span="6">
            <el-form-item
              label-width="0px"
              :prop="`customParams.${index}.key`"
              :rules="[{ required: true, message: '请填写' }]"
            >
              <el-input v-model="item.key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label-width="0px"
              :prop="`customParams.${index}.value`"
              :rules="[{ required: true, message: '请填写' }]"
            >
              <el-input v-model="item.value"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <i
              v-if="index == 0"
              class="el-icon-circle-plus-outline"
              style="font-size:24px;padding-top: 6px;"
              @click="onAddParams()"
            />
            <i
              v-else
              class="el-icon-remove-outline"
              style="font-size:24px;padding-top: 6px;"
              @click="onRemoveParams(index)"
            />
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="onClose()">关闭</el-button>
      <el-button type="primary" @click="onSubmit()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      type: '',
      model: {
        categoryId: '',
        customParams: []
      },
      categoryList: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        let params = this.url.split('?')[1]
        if (params) {
          let formatParams = qs.parse(params)
          Object.keys(formatParams).map((key) => {
            if (key in this.model) {
              // TODO: 是否需要把选中的数据填充
              // this.model[key] = formatParams[key]
            } else {
              this.model.customParams.push({ key, value: formatParams[key] })
            }
          })
        } else {
          this.model.customParams = [{ key: '', value: '' }]
        }
      }
    },
    type(val) {
      this.pageCategory(val)
    }
  },
  methods: {
    pageCategory(type) {
      this.$http.pageCategory({ type }).then((res) => {
        this.categoryList = res.data.data.list
      })
    },
    onAddParams() {
      this.model.customParams.push({ key: '', value: '' })
    },
    onRemoveParams(index) {
      this.model.customParams.splice(index, 1)
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.customParams.forEach((item) => {
            console.log(item.value)
            model[item.key] = item.value
          })
          delete model.customParams
          console.log(qs.stringify(model))
          this.onClose(this.url.split('?')[0] + '?' + qs.stringify(model))
        }
      })
    },
    onClose(url = null) {
      this.model = this.$options.data().model
      this.$emit('close', url)
    }
  }
}
</script>
