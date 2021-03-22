<template>
  <div class="behavior-tag-detail">
    <go-back title="标签详情"></go-back>
    <div class="container">
      <div class="overview">
        <div class="tag-detail">
          <div class="d-item">
            <div class="item-label">标签名称：</div>
            <div class="item-desc">{{ tagName }}</div>
          </div>
          <div class="d-item">
            <div class="item-label">所属标签组：</div>
            <div class="item-desc">{{ groupName }}</div>
          </div>
          <!-- <div class="d-item">
            <div class="item-label">标签分值：</div>
            <div class="item-desc">6</div>
          </div> -->
        </div>
      </div>
      <div class="customer-list">
        <div class="common-table-box">
          <com-table :tableData="tableData" :column="column"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { GoBack, ComTable, ComPagination },
  data() {
    return {
      tagId: '',
      tagName: '',
      groupName: '',
      tableData: [],
      column: [
        {
          label: '头像',
          align: 'center',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar || this.defaultHearderImage} alt="" width="44" height="44" />
          }
        },
        {
          label: '备注名',
          align: 'center',
          prop: 'remarks'
        },
        {
          label: '微信昵称',
          align: 'center',
          prop: 'name'
        },
        {
          label: '标签权重值',
          align: 'center',
          prop: 'behaviorScore'
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <el-button type="text" onClick={this.goToCustomerDetail.bind(this, row)}>
                客户详情
              </el-button>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.tagId = this.$route.query.id
      this.tagName = this.$route.query.tagName
      this.groupName = this.$route.query.groupName
      this.getCustomerList()
    }
  },
  methods: {
    // 获取客户列表
    getCustomerList() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        behaviorTagId: this.tagId
      }
      this.$http.getCustomerBelongBehaviorTag(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    // 查看客户详情
    goToCustomerDetail(row) {
      this.$router.push(`/main/scrm/customer-management/customer/detail?id=${row.customerId}&wxid=${row.wxCustomerId}`)
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getCustomerList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getCustomerList()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
  .overview {
    padding: 20px;
    background: #ffffff;
    margin-bottom: 20px;
    .tag-detail {
      .d-item {
        display: flex;
        line-height: 24px;
        padding: 10px 0;
        text-align: right;
        .item-label {
          width: 90px;
          color: #909399;
          margin-right: 10px;
        }
      }
    }
  }
  .customer-list {
    background: #ffffff;
    .common-table-box {
      padding: 20px 20px 0 20px;
    }
  }
}
</style>
