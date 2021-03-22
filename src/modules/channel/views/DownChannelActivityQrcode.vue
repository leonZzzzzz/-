<template>
  <el-dialog width="400px" :visible="visible" append-to-body :before-close="onClose">
    <div>
      <!-- <QcProductItem
        v-if="target"
        style="position: relative;line-height:23px;width: 340px;border: 1px solid #dcdfe6;padding: 10px;border-radius: 6px;margin-bottom: 10px;"
        :img="imgHost + target.iconUrl"
        :title="target.title"
      >
        <i
          @click="onClear(1)"
          class="el-icon-close"
          style="position:absolute;right:10px;top:10px;font-size:20px;cursor: pointer;"
        />
      </QcProductItem> -->
      <div
        v-if="target && target.title"
        style="position:relative;margin-bottom: 10px;border: 1px solid #dcdfe6;padding: 10px;border-radius: 6px;font-size: 14px;color: #616161;"
      >
        <p>{{ target.title }}</p>
        <i
          class="el-icon-close"
          style="position:absolute;right:10px;top:8px;font-size:20px;cursor: pointer;"
          @click="onClear(1)"
        />
      </div>
      <el-button size="mini" @click="onQcProductPickerShow('Activity')">选择目标</el-button>
    </div>
    <div style="margin:40px 0">
      <div
        v-if="channel && channel.channelName"
        style="position:relative;margin-bottom: 10px;border: 1px solid #dcdfe6;padding: 10px;border-radius: 6px;font-size: 14px;color: #616161;"
      >
        <p>{{ channel.channelName }}</p>
        <i
          class="el-icon-close"
          style="position:absolute;right:10px;top:8px;font-size:20px;cursor: pointer;"
          @click="onClear(2)"
        />
      </div>
      <el-button size="mini" @click="onQcProductPickerShow('Channel')">选择渠道</el-button>
    </div>
    <el-button @click="onSubmit()" type="primary" :loading="loading">绑定</el-button>
    <QcProductPickerb
      type="product"
      :module="module"
      :visible="productPickerVisible"
      @close="onQcProductPickerClose"
    ></QcProductPickerb>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {
          targetName: '',
          subChannel: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      module: 'Activity',
      productPickerVisible: false,
      channel: {},
      target: {}
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => {
        if (this.options) {
          this.target = { title: this.options.targetName, iconUrl: '' }
          this.channel = { channelName: this.options.subChannel }
        }
      })
    }
  },
  methods: {
    onClear(type) {
      if (type === 1) this.target = {}
      else this.channel = {}
    },
    onQcProductPickerShow(module) {
      this.module = module
      this.productPickerVisible = true
    },
    onQcProductPickerClose(row) {
      if (row) {
        if (this.module == 'Channel') {
          this.channel = row
        } else {
          this.target = row
        }
      }
      this.productPickerVisible = false
    },
    onClose() {
      this.target = {}
      this.channel = {}
      this.$emit('close', null)
    },
    onSubmit() {
      if (this.target || this.channel) {
        this.$emit('close', {
          targetId: this.target.id,
          targetName: this.target.title || this.target.name,
          channelCodeId: this.channel.id,
          targetType: this.target.module
        })
        this.target = {}
        this.channel = {}
      } else {
        this.$message.error('请绑定渠道或绑定目标')
      }
    }
  }
}
</script>
