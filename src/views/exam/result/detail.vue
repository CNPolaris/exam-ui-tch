<template>
  <div class="dashboard-container">
    <el-row :gutter="20" style="border-top-width: 10px">
      <el-col :xs="24" :sm="24" :lg="2">
        <div class="card-panel-description">
          <img :src="userInfo.avatar" style="height: 100px; width: 100px; border-radius: 40px" alt="头像">
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="2">
        <span>账号：{{ userInfo.userName }}</span><br>
        <span>姓名：{{ userInfo.realName }}</span>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="20">
        <el-row :gutter="20" class="panel-group">
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="count" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  考试次数
                </div>
                <count-to :start-val="0" :end-val="attendCount" :duration="2600" />
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="correctRate" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  正确率
                </div>
                <span>{{ correctRate }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="passRate" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  及格率
                </div>
                <span>{{ passRate }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="maxScore" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  最高分
                </div>
                <count-to :start-val="maxScore" :end-val="maxScore" :duration="2600" />
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="minScore" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  最低分
                </div>
                <count-to :start-val="minScore" :end-val="minScore" :duration="2600" />
              </div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="avgScore" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  平均分
                </div>
                <count-to :start-val="avgScore" :end-val="avgScore" :duration="2600" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="border-top-width: 10px">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <score-line-chart :score-line="scoreLine" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <score-rate-chart :score-line="scoreLine" />
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <h3>考试记录</h3>
      <el-table :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column prop="id" label="序号" width="70px" align="center" />
        <el-table-column prop="paperName" label="名称" width="350px" align="center" />
        <el-table-column prop="subjectName" label="学科" width="100px" align="center" />
        <el-table-column prop="paperTypeStr" label="试卷类型" width="100px" align="center" />
        <el-table-column prop="questionCount" label="题目数量" width="100px" align="center" />
        <el-table-column prop="paperScore" label="试卷总分" width="100px" align="center" />
        <el-table-column prop="questionCorrect" label="答对题数" width="100px" align="center" />
        <el-table-column prop="systemScore" label="系统判分" width="100px" align="center" />
        <el-table-column prop="userScore" label="用户得分" width="100px" align="center" />
        <el-table-column prop="status" label="状态" width="100px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="statusTagFormatter(row.status)">
              {{ statusTextFormatter(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="250px" align="center">
          <template slot-scope="{row}">
            {{ row.createTime|formatDateTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="{row}">
            <router-link v-if="row.status === 0 " target="_blank" :to="{path:'/answer/edit',query:{id:row.id}}">
              <el-button type="primary" size="small">批改</el-button>
            </router-link>
            <router-link v-if="row.status === 1 " target="_blank" :to="{path:'/answer/read',query:{id:row.id}}">
              <el-button type="text" size="small">查看答卷</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParam.page"
        :limit.sync="queryParam.limit"
        style="text-align: center"
        @pagination="getAnswerList"
      />
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CountTo from 'vue-count-to'
import Pagination from '@/components/Pagination'
import { getStudentInfo } from '@/api/user'
import { getStudentAnswerList } from '@/api/analysis'
import { getStudentRecordList } from '@/api/record'
import { formatDate } from '@/utils/date'
import ScoreLineChart from '@/views/exam/result/components/ScoreLineChart'
import ScoreRateChart from '@/views/exam/result/components/ScoreRateChart'
export default {
  components: { Pagination, CountTo, ScoreLineChart, ScoreRateChart },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      id: null,
      attendCount: 0,
      correctRate: 0,
      passRate: 0,
      maxScore: 0,
      minScore: 0,
      avgScore: 0,
      userInfo: {
        realName: '',
        userName: '',
        role: '',
        avatar: null
      },
      answerList: [],
      scoreLine: {
        paperScore: [],
        userScore: [],
        scoreRate: [],
        createTime: []
      },
      queryParam: {
        page: 1,
        limit: 10,
        createUser: null
      },
      list: [],
      total: 0,
      echartsScoreLineAction: null
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      statusEnum: state => state.exam.examPaperAnswer.statusEnum,
      statusTag: state => state.exam.examPaperAnswer.statusTag
    }),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', { subjects: state => state.subjects })
  },
  async created() {
    const id = this.$route.query.id
    const _this = this

    if (id && parseInt(id) !== 0) {
      _this.id = id
      getStudentInfo(_this.id).then(re => {
        _this.userInfo = re.data
      })
      await _this.getAnswerList()
    }
    // _this.echartsScoreLineAction.setOption(_this.scoreLineOption('得分情况', _this.scoreLine))
  },
  // mounted() {
  //   const _this = this
  //   _this.echartsScoreLineAction = echarts.init(document.getElementById('echarts-score-line'), 'macarons')
  // },
  methods: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    async getAnswerList() {
      const _this = this
      await getStudentAnswerList(_this.id).then(re => {
        if (re.code === 1000) {
          _this.answerList = null
        } else {
          _this.answerList = re.data
          _this.statisticsData()
        }
      })
      _this.getRecordList()
    },
    statisticsData() {
      const _this = this
      let questionCount = 0
      let correctCount = 0
      let passCount = 0
      let scoreSum = 0
      for (let i = 0; i < _this.answerList.length; i++) {
        _this.scoreLine.paperScore.push(_this.answerList[i].paperScore)
        _this.scoreLine.userScore.push(_this.answerList[i].userScore)
        _this.scoreLine.scoreRate.push(Math.round(_this.answerList[i].userScore / _this.answerList[i].paperScore * 10000) / 100.00)
        _this.scoreLine.createTime.push(this.formatDateTime(_this.answerList[i].createTime))
        questionCount = questionCount + _this.answerList[i].questionCount
        correctCount = correctCount + _this.answerList[i].questionCorrect
        if (_this.answerList[i].userScore > _this.answerList[i].paperScore * 0.6) {
          passCount++
        }
        scoreSum += _this.answerList[i].userScore
      }
      _this.maxScore = Math.max.apply(Math, _this.answerList.map(item => { return item.userScore }))
      _this.minScore = Math.min.apply(Math, _this.answerList?.map(item => { return item.userScore }))
      _this.avgScore = scoreSum / _this.answerList.length
      _this.passRate = Math.round(passCount / _this.answerList.length * 10000) / 100.00 + '%'
      _this.correctRate = Math.round(correctCount / questionCount * 10000) / 100.00 + '%'
      _this.attendCount = _this.answerList.length
    },
    getRecordList() {
      const _this = this
      _this.queryParam.createUser = this.id
      getStudentRecordList(_this.queryParam).then(re => {
        _this.list = re.data.list
        _this.total = re.data.total
      })
    },
    statusTagFormatter(status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusTextFormatter(status) {
      return this.enumFormat(this.statusEnum, status)
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  }
}
</script>

<style scoped>

</style>
