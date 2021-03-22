<template>
  <div>
    <QcTable
      ref="table"
      :search-form="searchForm"
      :option="{ url: `api/admin/v1/liveRoom/page` }"
      @get-list="onGetList"
    >
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="50px" align="center"></el-table-column> -->
        <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
        <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
        <el-table-column prop="title" label="直播间名称" align="center"></el-table-column>
        <el-table-column prop="mobile" label="直播人手机" align="center"></el-table-column>
        <el-table-column label="直播背景图" align="center">
          <template slot-scope="scope">
            <el-image :src="imgHost + scope.row.roomCoverUrl" fit="cover" style="width:50px;height:50px">
              <div slot="error" class="el-image__error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="允许评论" align="center">
          <template slot-scope="scope"> {{ scope.row.isAllowComment ? '是' : '否' }}</template></el-table-column
        >
        <!-- <el-table-column label="精选直播" align="center">
          <template slot-scope="scope">
            {{ scope.row.isGood ? '是' : '否' }}</template
          ></el-table-column
        > -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              {{
                {
                  '101': '直播中',
                  '102': '未开始',
                  '103': '已结束',
                  '104': '禁播',
                  '105': '暂停中',
                  '106': '异常',
                  '107': '已过期'
                }[scope.row.liveStatus]
              }}
            </div>
          </template></el-table-column
        >
        <el-table-column label="直播时间" width="100px" align="center" prop="startTime"></el-table-column>
        <el-table-column label="结束时间" width="100px" align="center" prop="endTime"></el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 0">
              <el-button type="text" @click="$router.push('/main/mall/store/room/data?id=' + scope.row.id)">
                直播概况
              </el-button>
              <el-button type="text" @click="deleteRoom(scope.row.id)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </QcTable>
    <el-dialog
      :visible="wxRoomDialogVisible"
      append-to-body
      title="关联直播间"
      width="550px"
      :before-close="onCloseWxRoomDialog"
      ><div>
        <el-button @click="wxRoomRefresh()" type="primary" :loading="refreshLoading">刷新直播间</el-button>
      </div>
      <QcTable
        ref="wxTable"
        :option="{ url: 'api/admin/v1/wxLiveRoom/page', isFull: false, height: '350px' }"
        :column="roomColumn"
      ></QcTable>
    </el-dialog>
    <el-dialog :visible="visible" append-to-body title="通过审核" width="450px" :show-close="false">
      <el-form ref="model" :model="model" label-width="120px" label-position="left">
        <el-form-item label="关联直播间" prop="wxliveRoomId" :rules="[{ message: '请关联直播房间', required: true }]">
          <el-button type="primary" size="mini" @click="wxRoomDialogVisible = true">选择直播间</el-button>
          <div v-if="model.name">已选：{{ model.name }}</div>
        </el-form-item>
        <el-form-item label="关联频道" prop="liveChannelId" :rules="[{ message: '请关联频道', required: true }]">
          <el-select v-model="model.liveChannelId">
            <el-option v-for="item in liveChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播小程序码" prop="wxliveCodeUrl">
          <QcImageUpload width="80px" height="80px" v-model="model.wxliveCodeUrl"></QcImageUpload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCloseAuditDialog()">关闭</el-button>
        <el-button type="primary" @click="onAuditPass()">通过审核</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      refreshLoading: false,
      model: {
        id: '',
        liveChannelId: '',
        wxliveRoomId: '',
        auditStatus: '',
        wxliveCodeUrl: ''
      },
      liveChannelList: [],
      wxRoomDialogVisible: false,
      visible: false,
      searchForm: [
        {
          label: '所属店铺',
          type: 'input',
          formName: 'storeName',
          value: ''
        },
        {
          label: '精选直播',
          type: 'select',
          formName: 'isGood',
          option: [
            { label: '全部', value: '' },
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ],
          value: ''
        },
        {
          formName: 'auditStatus',
          value: 0
        }
      ],
      menu: [
        {
          type: 'primary',
          label: '设为精选',
          on: () => {
            this.saveGoodLiveRoom(true)
          }
        },
        {
          type: 'primary',
          label: '取消精选',
          on: () => {
            this.saveGoodLiveRoom(false)
          }
        }
      ],
      tableData: [],
      roomColumn: [
        { type: 'index', label: '序号', align: 'center', width: '50px' },
        { prop: 'name', label: '直播间名称' },
        { prop: 'roomId', label: '房间Id' },
        {
          label: '操作',
          align: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.wxRoomDialogVisible = false
                    this.model.wxliveRoomId = row.id
                    this.model.name = row.name
                  }}
                >
                  关联
                </el-button>
              </div>
            )
          }
        }
      ],
      ids: ''
    }
  },
  created() {
    this.$http.get('api/v1/liveChannel/page', { pageSize: 50 }).then((res) => {
      this.liveChannelList = res.data.data.list
    })
  },
  methods: {
    onGetList(list) {
      this.tableData = list
    },
    onSearch(v) {
      this.searchForm[1].value = v.name
      this.$refs.table.transformSearchForm().then(() => {
        this.$refs.table.onSearch()
      })
    },
    onCloseWxRoomDialog() {
      this.wxRoomDialogVisible = false
    },
    onCloseAuditDialog() {
      this.visible = false
      this.$refs.model.clearValidate()
      this.model = {
        id: '',
        wxliveRoomId: '',
        auditStatus: '',
        wxliveCodeUrl: ''
      }
    },
    onAuditPass() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.auditLiveRoom(this.model)
        }
      })
    },
    deleteRoom(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteLiveRoom({ id }).then((res) => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    auditLiveRoom(model) {
      const { id, auditStatus, wxliveCodeUrl, wxliveRoomId, liveChannelId, auditDescription } = model
      this.$http
        .auditLiveRoom({
          id,
          auditStatus,
          wxliveCodeUrl,
          wxliveRoomId,
          liveChannelId,
          auditDescription
        })
        .then(() => {
          this.$refs.table.onSearchKeep()
          this.onCloseAuditDialog()
        })
    },
    wxRoomRefresh() {
      this.refreshLoading = true
      this.$http
        .post('api/admin/v1/wxLiveRoom/refresh')
        .then(() => {
          this.refreshLoading = false
          this.$message.success('刷新成功')
          this.$refs.wxTable.onSearch()
        })
        .catch(() => {
          this.refreshLoading = false
        })
    },
    saveGoodLiveRoom(isGood) {
      this.$http.saveGoodLiveRoom({ isGood, ids: this.ids }).then((res) => {
        this.$refs.table.onSearch()
      })
    },
    handleSelectionChange(row) {
      const id = row.map((item) => item.id)
      this.ids = id.join('_')
    }
  }
}
</script>
