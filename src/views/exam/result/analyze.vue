<template>
  <div class="app-container">
    <el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="考生成绩" name="first">
          <el-row style="border-top-width: 10px">
            <el-form :inline="true">
              <el-form-item label="选择班级：">
                <el-select v-model="queryParam.classId" placeholder="班级" style="width: 100px" @change="getClassPaper">
                  <el-option v-for="item in allClasses" :key="item.id" :value="item.id" :label="item.className" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择试卷">
                <el-select v-model="queryParam.paperId" placeholder="试卷" @change="getStudentResult">
                  <el-option v-for="item in classPaper" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row :hidden="showStudentResult" style="border-top-width: 10px;">
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">应参加人数</span><br>
                <span>{{ statisticsInfo.shouldAttend }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">已参加人数</span><br>
                <span>{{ statisticsInfo.attended }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">缺考人数</span><br>
                <span>{{ statisticsInfo.shouldAttend - statisticsInfo.attended }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">及格人数</span><br>
                <span>{{ statisticsInfo.passCount }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">不及格人数</span><br>
                <span>{{ statisticsInfo.attended-statisticsInfo.passCount }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">最高分</span><br>
                <span>{{ statisticsInfo.maxScore }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">最低分</span><br>
                <span>{{ statisticsInfo.minScore }}</span>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card align="center" style="height: 80px; width: 150px">
                <span class="statistics-font" style="width: 20px">平均分</span><br>
                <span>{{ statisticsInfo.avgScore }}</span>
              </el-card>
            </el-col>
          </el-row>

            <el-table :hidden="showStudentResult" :data="studentResult" border fit highlight-current-row style="border-top-width: 10px;width: 100%;">
              <el-table-column prop="userAccount" align="center" label="账号" width="200" />
              <el-table-column prop="userName" align="center" label="姓名" width="200" />
              <el-table-column align="center" label="提交时间" width="200">
                <template slot-scope="{row}">
                  {{ row.createTime|formatDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="doTime" align="center" label="答题时间" width="150" />
              <el-table-column align="center" label="总分/及格分">
                <template slot-scope="{row}">
                  {{ row.paperScore }}/{{ row.paperScore*0.6 }}
                </template>
              </el-table-column>
              <el-table-column prop="userScore" align="center" label="成绩" />
              <el-table-column prop="correctRate" align="center" label="正确率" />
              <el-table-column align="center" label="及格">
                <template slot-scope="{row}">
                  <el-tag :type="passTagFormatter(row.isPass)">
                    {{ passTextFormatter(row.isPass) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="order" label="排名" />
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <router-link target="_blank" :to="{path:'/exam/answer/read',query:{id:row.id}}">
                    <el-button type="text" size="small">查看答卷</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="studentResultTotal>0" :total="studentResultTotal" :page.sync="queryParam.page" :limit.sync="queryParam.limit" @pagination="getStudentResult" />

        </el-tab-pane>
        <el-tab-pane label="成绩统计">
          成绩统计
        </el-tab-pane>
        <el-tab-pane label="缺考统计">
          缺考统计
        </el-tab-pane>
        <el-tab-pane label="答题统计">
          答题统计
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getClassList } from '@/api/classes'
import { getPaperByClassId } from '@/api/exam'
import { getStudentResultPage, getStatisticsInfo } from '@/api/analysis'
import { formatDate } from '@/utils/date'

export default {
  name: 'Analyze',
  components: { Pagination },
  directives: { waves },
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
      showStudentResult: true,
      activeName: 'first',
      paperId: null,
      allClasses: [],
      classId: null,
      queryParam: {
        page: 1,
        limit: 10,
        classId: null,
        paperId: null,
        date: null
      },
      studentResultTotal: 0,
      studentResult: [],
      classPaper: [],
      statisticsInfo: {
        shouldAttend: 0,
        attended: 0,
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        passCount: 0
      }
    }
  },
  async created() {
    const _this = this
    _this.paperId = this.$route.query.id
    await getClassList().then(re => {
      _this.allClasses = re.data
    })
  },
  methods: {
    getClassPaper() {
      const _this = this
      getPaperByClassId(this.queryParam.classId).then(re => {
        _this.classPaper = re.data
      })
    },
    compare(property) {
      return function(a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2
      }
    },
    getStudentResult() {
      const _this = this
      getStudentResultPage(this.queryParam).then(re => {
        const { data } = re
        _this.studentResult = data.list
        _this.studentResultTotal = data.total
        _this.studentResult.sort(this.compare('userScore'))
        for (let i = 0; i < _this.studentResult.length; i++) {
          _this.studentResult[i].correctRate = Math.round(_this.studentResult[i].questionCorrect / _this.studentResult[i].questionCount * 10000) / 100.00 + '%'
          _this.studentResult[i].isPass = _this.studentResult[i].userScore >= _this.studentResult[i].paperScore
          _this.studentResult[i].isPass = _this.studentResult[i].userScore >= _this.studentResult[i].paperScore * 0.6
          _this.studentResult[i].order = i + 1
        }
      })
      getStatisticsInfo(this.queryParam).then(re => {
        _this.statisticsInfo = re.data
      })
      this.showStudentResult = false
    },
    passTagFormatter(isPass) {
      if (isPass) {
        return 'success'
      } else {
        return 'warning'
      }
    },
    passTextFormatter(isPass) {
      if (isPass) {
        return '及格'
      } else {
        return '不及格'
      }
    }
  }
}
</script>

<style scoped>
.statistics-font {
  font-size: 10px;
  color: gray;
}

</style>
