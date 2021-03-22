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
      <el-form-item label="图片" prop="imgUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload
          :data="{ imageType: 'attachment' }"
          width="100px"
          height="100px"
          v-model="model.imgUrl"
        ></QcImageUpload>
        <p>建议尺寸750 * 280，大小不超过3M</p>
      </el-form-item>
      <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="model.type" style="width:100%;" @change="onChangeType">
          <el-option v-for="item in types" :key="item.index" :label="item.name" :value="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="model.type === 'linkurl'" label="名称" prop="name">
        <el-input v-model="model.name" maxlength="120"></el-input>
      </el-form-item>
      <el-form-item
        label="链接"
        prop="link"
        :rules="[{ required: true, message: '该字段不能为空' }]"
        v-if="model.type !== 'noHref'"
      >
        <el-input v-model="model.link" v-if="model.type === 'linkurl'"></el-input>
        <div v-else>
          <QcProductItem v-if="model.linkName" :img="imgHost + model.linkIcon" :title="model.linkName"></QcProductItem>
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
      <el-form-item label="备注" prop="remark">
        <el-input v-model="model.remark" maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input-number v-model="model.seq"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <QcProductPicker
      :visible="productPickerVisible"
      :type="['product']"
      :module="module"
      @close="onQcProductPickerClose"
    />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        imgUrl: '',
        name: '',
        serviceType: 'smallProgram',
        type: '',
        link: '',
        linkIcon: '',
        linkName: '',
        startTime: '',
        endTime: '',
        startTimeAndEndTime: '',
        remark: '',
        seq: ''
      },
      productPickerVisible: false,
      types: [],
      loading: false
    }
  },
  created() {
    this.pageAttachmentType()
  },
  computed: {
    module() {
      return {
        product: 'Mall',
        activity: 'Activity',
        journey: 'Journey',
        groupshop: 'MallGroupShopping'
      }[this.model.type]
    }
  },
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
      this.model.name = ''
      this.model.link = ''
      this.model.linkIcon = ''
      this.model.linkName = ''
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
          this.loading = true
          this.saveModel(this.id ? 'updateCarousel' : 'addCarousel', model)
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
        this.model.link = row.id
        this.model.name = row.name || row.title
        this.model.linkName = row.name || row.title
        this.model.linkIcon = row.cover || row.iconUrl
      }
      this.productPickerVisible = false
    }
  }
}
</script>
