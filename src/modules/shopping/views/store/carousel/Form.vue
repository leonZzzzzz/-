<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="100px" label-position="left" hide-required-asterisk>
      <el-form-item label="图片" prop="imgLinks" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload
          :data="{ imageType: 'attachment' }"
          width="100px"
          height="100px"
          v-model="model.imgLinks"
        ></QcImageUpload>
        <p>建议尺寸750 * 320，大小不超过3M</p>
      </el-form-item>
      <el-form-item label="类型" prop="skipType" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="model.skipType" style="width:100%;" @change="onChangeType">
          <el-option v-for="item in types" :key="item.index" :label="item.name" :value="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="链接"
        prop="skipLinks"
        :rules="[{ required: true, message: '该字段不能为空' }]"
        v-if="model.skipType !== 'noskip'"
      >
        <el-input v-model="model.skipLinks" v-if="model.skipType != 'product'"></el-input>
        <div v-else>
          <QcProductItem
            v-if="model.productName"
            :img="imgHost + model.productIcon"
            :title="model.productName"
          ></QcProductItem>
          <el-button style="margin-top:10px" @click="productPickerVisible = true" size="mini">关联产品</el-button>
        </div>
      </el-form-item>
      <el-form-item label="有效期" prop="startTimeAndEndTime" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-date-picker
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="model.startTimeAndEndTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="排序" prop="sortNum" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input-number v-model="model.sortNum"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <QcProductPicker
      :type="type"
      :module="module"
      :beform-value="model"
      :visible="productPickerVisible"
      @close="onQcProductPickerClose"
    ></QcProductPicker>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    storeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        imgLinks: '',
        skipType: 'noskip',
        skipLinks: '',
        productIcon: '',
        productName: '',
        startTime: '',
        endTime: '',
        startTimeAndEndTime: '',
        sortNum: '',
        type: 'store'
      },
      productPickerVisible: false,
      type: ['product'],
      module: ['Mall'],
      types: [
        {
          index: 'product',
          name: '商品'
        },
        {
          index: 'noskip',
          name: '不跳转'
        }
      ],
      loading: false
    }
  },
  // created() {
  //   this.pageAttachmentType()
  // },
  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          this.getCarousel()
        }
      }
    }
  },
  methods: {
    onChangeType() {
      this.model.skipLinks = ''
      this.model.productIcon = ''
      this.model.productName = ''
    },
    pageAttachmentType() {
      this.$http.pageAttachmentType().then((res) => {
        this.types = res.data.data
      })
    },
    getCarousel() {
      this.$http.getCarousel({ id: this.id }).then((res) => {
        this.model = res.data.data
        this.$set(this.model, 'startTimeAndEndTime', [this.model.startTime, this.model.endTime])
      })
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.startTime = model.startTimeAndEndTime[0]
          model.endTime = model.startTimeAndEndTime[1]
          if (!model.storeId) model.storeId = this.storeId
          this.loading = true
          this.saveModel(this.model.id ? 'updateCarousel' : 'addCarousel', model)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateCarousel' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    },
    onQcProductPickerClose(row) {
      if (row) {
        this.model.skipLinks = row.id
        this.model.productName = row.name || row.title
        this.model.productIcon = row.cover || row.iconUrl
      }
      this.productPickerVisible = false
    }
  }
}
</script>
