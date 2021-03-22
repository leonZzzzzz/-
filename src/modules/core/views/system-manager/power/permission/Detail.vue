<template>
  <el-card>
    <el-button type="primary" size="small" @click="insert()">添加</el-button>
    <br />
    <br />
    <div>
      <table class="power-permission" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <td>名称</td>
            <td>许可</td>
            <td>链接</td>
            <td>状态</td>
            <!-- <td>排序</td> -->
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in listByParent" :key="i" v-show="!item.isDeleted">
            <td>{{ item.name }}</td>
            <td>{{ item.permission }}</td>
            <td>{{ item.url }}</td>
            <td style="min-width: 40px;">{{ item.isDeleted ? '作废' : '正常' }}</td>
            <!-- <td>{{item.seqNum}}</td> -->
            <td style="min-width: 130px;">
              <el-button size="mini" type="primary" @click="update(item)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteConfirm(item.id)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <dig-form
      :visible="digFormWrap"
      :id="updateId"
      :parentId="parentId"
      @close="digClose"
      resourceType="button"
    ></dig-form>
  </el-card>
</template>

<script>
import DigForm from './Form'
export default {
  components: {
    DigForm
  },
  data() {
    return {
      updateId: '',
      parentId: '',
      digFormWrap: false,
      listByParent: []
    }
  },
  created() {
    this.listByParentId()
  },
  methods: {
    async listByParentId() {
      let res = await this.$http.listByParentId({ id: this.$route.query.id })
      console.log(res.data)
      this.listByParent = res.data.data
    },
    insert() {
      this.parentId = this.$route.query.id
      this.digFormWrap = true
    },
    update(item) {
      this.updateId = item.id
      this.digFormWrap = true
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(id)
        })
        .catch(() => {
          return
        })
    },
    async delete(id) {
      await this.$http.deletePermission({ id: id })
      this.listByParentId()
      this.$message.success('删除成功')
    },
    digClose(flag) {
      this.updateId = ''
      this.digFormWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.listByParentId()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.power-permission {
  text-align: left;
  border-bottom: 1px solid #ddd;
  width: 100%;
  th,
  td {
    padding: 10px;
  }
  td {
    border-top: 1px solid #ddd;
  }
  tbody {
    tr {
      &:nth-child(odd) {
        td {
          background-color: #f9f9f9;
        }
      }
      &:hover {
        td {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
</style>
