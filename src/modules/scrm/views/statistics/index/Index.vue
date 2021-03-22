<template>
  <div class="statistics-wrap">
    <div class="statistics-l">
      <div class="xfo-statistics-header">
        <div class="xfo-customer">
          <sta-title lookText="查看客户" @lookLink="$router.push('/main/scrm/customer-management/customer/list')"
            >客户统计</sta-title
          >
          <div class="xfo-content">
            <sta-data-block
              :title="item.title"
              :data="item.data"
              :percent="item.percent"
              :isTip="item.isTip"
              :tipContent="item.tipContent"
              :type="item.percent >= 0 ? 'up' : 'down'"
              v-for="(item, index) in customerData"
              :key="index"
            ></sta-data-block>
          </div>
        </div>
        <div class="xfo-group">
          <sta-title lookText="查看客户群" @lookLink="$router.push('/main/scrm/customer-management/colony/list')"
            >群统计</sta-title
          >
          <div class="xfo-content">
            <sta-data-block
              :title="item.title"
              :data="item.data"
              :percent="item.percent"
              :type="item.percent >= 0 ? 'up' : 'down'"
              v-for="(item, index) in groupData"
              :key="index"
            ></sta-data-block>
          </div>
        </div>
        <div class="xfo-Conversation" v-if="isOpen">
          <sta-title lookText="查看消息存档" @lookLink="$router.push('/main/scrm/control/message/index')"
            >昨日联系客户</sta-title
          >
          <div class="xfo-content">
            <sta-data-block
              :title="item.title"
              :data="item.data"
              v-for="(item, index) in conversationData"
              :key="index"
              :isLast="false"
            ></sta-data-block>
          </div>
        </div>
      </div>
      <div class="xfo-statistics-main">
        <tab-button :navList="navList" @change="changeNav"></tab-button>
        <div class="xfo-statistics-content">
          <Customer v-if="tabIndex == 0"></Customer>
          <Group v-if="tabIndex == 1"></Group>
          <Lachine v-if="tabIndex == 2"></Lachine>
          <Conversation v-if="isOpen && tabIndex == 3"></Conversation>
        </div>
      </div>
    </div>
  
    <div class="statistics-r">
      <section class="app-box" v-if="appData && appData.name">
        <p class="app-box__name">{{appData.name}}</p>
        <p class="app-box__date">到期时间：{{appData.endDate ? appData.endDate.slice(0, 10) : ''}}</p>
        <p class="app-box__day">剩余 <span>{{lastDay}}</span> 天</p>
      </section>
      <StaBox sign-title="新手引导" :list="[{title: '小数桔企微SCRM操作手册', url: 'https://docs.qq.com/doc/DTnNMdGhGbmRjUHda'},{title: '常见问题', url: 'https://docs.qq.com/doc/DTlVRanpnbnhWQ0lt'}]" />
      <!-- <StaBox sign-title="企微学院" :list="[{title: '企微管家使用手册', url: ''}, {title: '常见问题', url: ''}]" /> -->
    </div>

  </div>
</template>

<script>
import TabButton from '@/modules/scrm/components/components/TabButton.vue'
import StaDataBlock from '../components/StaDataBlock.vue'
import StaTitle from '../components/StaTitle.vue'
import StaBox from '../components/StaBox.vue'
import Customer from './Customer.vue'
import Group from './Group.vue'
import Lachine from './Lachine.vue'
import Conversation from './Conversation.vue'
const Dayjs = require('dayjs')
export default {
  components: {
    StaTitle,
    StaDataBlock,
    StaBox,
    TabButton,
    Customer,
    Group,
    Lachine,
    Conversation
  },
  created() {
    this.customerGrowthRealTime()
    this.groupGrowthRealTime()
    this.conversationGrowthYesterday()
    this.getOpenStatus()
    this.getAppData()
  },
  data() {
    return {
      customerData: [],
      groupData: [],
      conversationData: [],
      navList: [
        { name: '客户增长', isActive: true },
        { name: '客户群增长', isActive: false },
        { name: '拉新排行', isActive: false },
        { name: '会话记录', isActive: false }
      ],
      tabIndex: 0,
      isOpen: true,
      // styleA: 'calc(30% - 8px)',
      // styleB: 'calc(40% - 8px)',
      appData: {}
    }
  },
  computed: {
    lastDay() {
      if (!this.appData || !this.appData.endDate) return null
      let start = Dayjs()
      let end = Dayjs(this.appData.endDate)
      let day = (end - start) / (1000 * 3600 * 24)
      // console.log(start.format(), end.format(), this.appData.endDate) 
      return day.toFixed(0)
    }
  },
  methods: {
    /*页面渲染*/
    changeNav(index) {
      this.tabIndex = index
    },
    /*数据获取*/
    customerGrowthRealTime() {
      this.$http.customerGrowthRealTime().then(res => {
        let data = res.data.data
        this.customerData = [
          {
            title: '客户总数',
            data: data.customerQuantity || 0,
            percent: data.quantityGrowthRate || 0,
            isTip: true,
            tipContent: '客户与成员关系，如客户A分别属于成员A和成员B，则计算为两个关系客户'
          },
          {
            title: '今日新增客户',
            data: data.todayRequest || 0,
            percent: data.requestGrowthRate || 0,
            isTip: false,
            tipContent: ''
          },
          {
            title: '今日净增客户',
            data: data.todayAdd || 0,
            percent: data.addGrowthRate || 0,
            isTip: true,
            tipContent: '今日净增加客户=今日申请-今日删除/拉黑'
          },
          {
            title: '今日流失客户',
            data: data.todayLose || 0,
            percent: data.loseGrowthRate || 0,
            isTip: false,
            tipContent: ''
          }
        ]
      })
    },
    groupGrowthRealTime() {
      this.$http.groupGrowthRealTime().then(res => {
        let data = res.data.data
        console.log(data)
        this.groupData = [
          {
            title: '群总数',
            data: data.groupQuantity || 0,
            percent: data.quantityGrowthRate || 0
          },
          {
            title: '今日入群',
            data: data.todayJoin || 0,
            percent: data.joinGrowthRate || 0
          },
          {
            title: '今日退群',
            data: data.todayQuit || 0,
            percent: data.quitGrowthRate || 0
          }
        ]
      })
    },
    conversationGrowthYesterday() {
      this.$http.conversationGrowthYesterday().then(res => {
        let data = res.data.data
        this.conversationData = [
          {
            title: '聊天总数',
            data: data ? data.conversationQuantity || 0 : 0
          },
          {
            title: '客户送达',
            data: data ? data.customerConversationQuantity || 0 : 0
          },
          {
            title: '成员回复',
            data: data ? data.repliedCustomerConversationQuantity || 0 : 0
          },
          {
            title: '平均回复时长',
            data: data ? data.avgFirstReplySpeed || 0 : 0
          }
        ]
      })
    },
    getOpenStatus() {
      this.$http.getOpenStatus().then(res => {
        this.isOpen = res.data.data
        if (!this.isOpen) {
          this.navList.pop()
          this.styleA = 'calc(40% - 8px)'
          this.styleB = 'calc(60% - 8px)'
        } else {
          this.styleA = 'calc(30% - 8px)'
          this.styleB = 'calc(40% - 8px)'
        }
      })
    },
    getAppData() {
      let user = localStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
        if (user.app) {
          this.appData = user.app
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-wrap {
  display: flex;
  .statistics-l {
    flex: 1;
  }
  .statistics-r {
    flex-shrink: 0;
    padding-left: 20px;
    .app-box {
      margin-bottom: 20px;
      padding: 20px;
      width: 230px;
      font-size: 14px;
      color: #a6a6a6;
      overflow: hidden;
      box-sizing: border-box;
      background-color: #fff;
      line-height: 1.5;
      &__name {
        font-size: 15px;
        font-weight: bold;
        padding-bottom: 20px;
        color: #020202;
      }
      &__date {
        margin-bottom: 5px;
      }
      &__day {
        span {
          color: #22b14c;
          font-weight: bold;
        }
      }
    }
  }
}

.xfo-statistics-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: -20px; // 抵消子元素的margin
  .xfo-customer,
  .xfo-group,
  .xfo-Conversation {
    padding: 20px;
    margin-bottom: 20px;
    width: calc(40% - 10px);
    box-sizing: border-box;
    background-color: #fff;
    .xfo-content {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }
  .xfo-customer {
    width: calc(60% - 10px);
  }
  .xfo-Conversation {
    width: 100%;
  }
  @media only screen and (max-width: 1370px) {
    .xfo-customer,
    .xfo-group,
    .xfo-Conversation {
      width: 100% !important;
    }
  }
}
.xfo-statistics-main {
  margin-top: 20px;
  width: 100%;
  .xfo-statistics-content {
    background-color: #fff;
    padding: 20px;
  }
}

.xfo-statistics-content ::v-deep .tableContent {
  // 此处将表格组件的宽度改为100%，以适配响应式（随窗口大小变化）
  // 因为组件内部在初始化后会写宽度，窗口变化不会重新计算
  .el-table {
    width: 100%;
    .el-table__header-wrapper table,.el-table__body-wrapper table, .el-table__empty-block{
      width: 100% !important;
    }
    .el-table__body, .el-table__footer, .el-table__header{
      table-layout: auto;
    }
  }
}
</style>