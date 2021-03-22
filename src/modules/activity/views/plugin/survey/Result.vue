<template>
  <QcNavigationPage full content="问卷结果">
    <!-- 问卷结果 -->
    <div class="result">
      <div class="base-info">
        <h3>问卷基本信息</h3>
        <p>问卷名称：{{ result.title }}</p>
        <p>开始时间：{{ result.startTime }}</p>
        <p>目前参与人数：{{ result.joinNum }}人</p>
      </div>
      <div class="result-list">
        <h3>问卷结果</h3>
        <div v-if="item.type == 3" class="result-item" v-for="item in result.questionList" :key="item.id">
          <p>
            <span>{{ item.seqNum }}、{{ item.title }}</span>
            <span style="color: #666; padding: 0 10px;">(默认显示最新5条)</span>
            <span style="color: #fec02d;cursor: pointer;" @click="openDialogTable(item.id)">查看全部>>></span>
          </p>
          <p class="option" v-for="answer in item.answerList" :key="answer.id">
            <span style="color: #666;">{{ answer.textAnswer }}</span>
          </p>
        </div>
        <div v-else class="result-item">
          <p>{{ item.seqNum }}、{{ item.title }}</p>
          <p class="option" v-for="(answer, index) in item.optionList" :key="index">
            <el-progress
              class="progress"
              :percentage="result.joinNum ? ((answer.chooseNum || 0) / result.joinNum) * 100 : 0"
              color="#fec02d"
            ></el-progress>
            <span>{{ answer.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 全部答案-->
    <el-dialog
      title="回答列表"
      width="70%"
      :visible.sync="dialogTable"
      @close="closeDialogTable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <qc-table-old
        v-if="dialogTable"
        ref="table"
        style="padding-bottom: 30px;"
        :autoHeight="400"
        selection
        border
        :table-list="showData"
        :search="searchData"
        url="api/admin/v1/question/textAnswerPage"
      ></qc-table-old>
    </el-dialog>
    <div slot="footer">
      <el-button @click="apiExport">导出结果</el-button>
    </div>
  </QcNavigationPage>
</template>

<script>
import { tableMixin } from 'jsSchool/tableMixin'
import { BASEURL } from '@/utils/config'

export default {
  mixins: [tableMixin],
  data() {
    return {
      digImgWrap: false,
      dialogTable: false,
      areaHeight: 0,
      activeIndex: 1,
      base: {
        surveyId: '',
        model: []
      },
      result: {},
      tagList: [],
      searchData: {
        questionId: ''
      },
      showData: [
        { template: 'index' },
        { prop: 'name', label: '会员', width: '200' },
        { prop: 'textAnswer', label: '内容' }
      ],
      imgObj: {
        imgIndex: null,
        imgType: null
      },
      dragOptions: {
        dragClass: 'drag-item',
        handle: '.drag-btn',
        animation: 300
      },
      loading: false,
      dataLoading: false
    }
  },
  computed: {
    getPercentage(val) {
      if (!val) return val
      console.log(val / this.result.joinNum)
      return val / this.result.joinNum
    }
  },
  created() {
    this.surveyResult(this.$route.query.id)
  },
  methods: {
    surveyResult(id) {
      this.$http.surveyResult({ id }).then((res) => {
        this.result = res.data.data
        this.dataLoading = false
      })
    },

    openDialogTable(id) {
      this.dialogTable = true
      this.searchData.questionId = id
    },
    closeDialogTable(flag) {
      this.dialogTable = false
      if (flag == 1) {
        // this.searchData.questionId = ''
      }
    },
    // 导出
    apiExport() {
      location.href = `${BASEURL}/api/admin/v1/survey/export?id=${this.$route.query.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
.result {
  .base-info {
    p {
      margin-top: 20px;
    }
  }
  .result-list {
    margin-top: 25px;
    .result-item {
      p {
        margin-top: 25px;
      }
      .option {
        margin-left: 10px;
      }
      .progress {
        display: inline-block;
        width: 200px;
      }
    }
  }
}
</style>
