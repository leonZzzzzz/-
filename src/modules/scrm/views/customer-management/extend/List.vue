<template>
  <div class="PAGE">
    <!-- <GoBack :title="'扩展字段'"></GoBack> -->
    <div class="main_content">
      <div class="title">
        基本字段<el-button
          style="margin-left: 10px"
          plain
          size="mini"
          @click="configureBaseSetting.visible = true"
        >设置</el-button>
      </div>
      <div class="base">
        <el-tag
          class="tag"
          effect="plain"
          v-for="(item, index) in defaultBaseListl"
          :key="index"
        >
          <el-button
            type="text"
            icon="el-icon-success"
            class="get"
          ></el-button>{{ item }}
        </el-tag>
        <el-tag
          class="tag"
          effect="plain"
          v-for="(item, index) in defaultList"
          :key="item + index"
          v-if="item.isEnabled"
        >
          <el-button
            type="text"
            :icon="item.isChecked ? 'el-icon-success' : 'el-icon-circle-close'"
            class="get"
          ></el-button>{{ item.name }}
        </el-tag>
      </div>
      <!-- @click="changeUsing(index)" -->
      <div class="custom">
        <Custom
          :tableData="list"
          @refresh="getlistDefault"
        ></Custom>
      </div>
    </div>
    <Dialog
      :configure="configureBaseSetting"
      :height="'300px'"
      @closeDialog="closeDialogBaseSetting"
      @success="successBaseSetting"
    >
      <div class="beforeWords">
        说明：
        <el-button
          type="text"
          disabled
          icon="el-icon-success"
        ></el-button>系统默认
        <el-button
          type="text"
          icon="el-icon-success"
        ></el-button>为显示
        <el-button
          type="text"
          icon="el-icon-circle-close"
        ></el-button>为不显示
      </div>
      <div class="tagList">
        <el-tag
          class="tag"
          effect="plain"
          type="info"
          v-for="(item, index) in defaultBaseListl"
          :key="index"
        >
          <el-button
            type="text"
            icon="el-icon-success"
            disabled
            class="get"
          ></el-button>{{ item }}
        </el-tag>
      </div>
      <div class="tagList">
        <el-tag
          class="tag"
          effect="plain"
          v-for="(item, index) in defaultList"
          :key="index"
          v-if="item.isEnabled"
        >
          <el-button
            type="text"
            :icon="item.isChecked ? 'el-icon-success' : 'el-icon-circle-close'"
            class="get"
            @click="changeBaseInfoIsCheck(index)"
          ></el-button>{{ item.name }}
        </el-tag>
      </div>
    </Dialog>
  </div>
</template>

<script>
// import GoBack from '../../../components/components/GoBack'
import Dialog from '../../../components/components/Dialog'
import Custom from './Custom'
export default {
  components: {
    Custom,
    Dialog
  },
  data() {
    return {
      // defaultBaseListl: ['备注名', '企业', '电话', '邮箱', '简介'],
      defaultBaseListl: ['备注名', '企业', '电话', '邮箱', '描述'],
      defaultList: [],
      list: [],
      // 基础字段设置
      configureBaseSetting: {
        title: '基础字段设置',
        visible: false,
        width: '700px'
      }
    }
  },
  methods: {
    // ---页面渲染---
    // 对话框取消
    closeDialogBaseSetting() {
      this.configureBaseSetting.visible = false
      this.getlistDefault()
    },
    // 对话框确认
    successBaseSetting() {
      console.log(this.defaultList)
      let ids = ''
      this.defaultList.forEach(item => {
        if (item.isChecked) {
          ids = ids + '_' + item.id
        }
      })
      ids = ids.slice(1)
      console.log(ids)
      this.updateSaveDefault({ ids }, res => {
        this.configureBaseSetting.visible = false
        this.getlistDefault()
      })
    },
    // 切换基础按钮显示与不显示
    changeBaseInfoIsCheck(index) {
      if (this.defaultList[index].isChecked) {
        this.defaultList[index].isChecked = false
      } else {
        this.defaultList[index].isChecked = true
      }
    },
    // 切换启用与停用
    changeUsing(index) {
      let data = this.defaultList[index]
      if (data.isEnabled) {
        console.log('启用的', '进行停用操作')
        this.stopUsing(data)
      } else {
        console.log('停用的', '进行启用操作')
        this.openUsing(data)
      }
    },
    // ---获取数据---
    getlistDefault() {
      console.log('aa')
      this.$http.getlistDefault().then(res => {
        console.log('bb')
        console.log('数据', res.data.data)
        this.defaultList = res.data.data.defaultList
        this.list = res.data.data.list
        console.log('cc')
      })
    },
    //停用按钮
    stopUsing(data) {
      this.$confirm('是否停用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          data.isEnabled = false
          this.$http.updateField(data).then(() => {
            this.$message.success('停用成功')
            this.getlistDefault()
          })
        })
        .catch(() => {
          return
        })
    },
    //启用按钮
    openUsing(data) {
      this.$confirm('是否启用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          data.isEnabled = true
          this.$http.updateField(data).then(() => {
            this.$message.success('启用成功')
            this.getlistDefault()
          })
        })
        .catch(() => {
          return
        })
    },
    // 修改默认字段显示与不显示
    updateSaveDefault(options, callback) {
      this.$http.updateSaveDefault(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    }
  },
  created() {
    this.getlistDefault()
  }
}
</script>

<style lang="scss" scoped>
.PAGE {
  height: 100%;
}
.main_content {
  background-color: #ffffff;
  padding: 20px 20px 50px;
  min-height: calc(100% - 130px);
  .title {
    padding: 14px 0;
    font-size: 16px;
    color: #606266;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 20px;
      background-color: #294a7b;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      left: -20px;
    }
  }
  .tag {
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
  }
  .base {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .get,
  .del {
    padding: 0;
    margin: 0;
    border: none;
    ::v-deep i {
      font-size: 16px;
    }
  }
  .get {
    margin-right: 5px;
  }
}
.tagList {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .tag {
    margin-right: 10px;
    display: flex;
    margin-bottom: 10px;
  }
  .get {
    padding: 0;
    margin: 0;
    border: none;
    ::v-deep i {
      font-size: 16px;
    }
    margin-right: 5px;
  }
}
</style>
