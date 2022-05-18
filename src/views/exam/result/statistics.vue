<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="选择班级：">
        <el-select v-model="queryParam.classId">
          <el-option v-for="item in allClasses" :key="item.id" :value="item.id" :label="item.className" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="margin:0 0 20px 20px" type="primary" icon="el-icon-document" @click="handleDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table id="statistics-list" :data="list" fit highlight-current-row>
      <el-table-column prop="order" label="序号" align="center" />
      <el-table-column prop="userName" label="帐户" align="center" />
      <el-table-column prop="realName" label="姓名" align="center" />
      <el-table-column prop="shouldAttendCount" label="应参与次数" align="center" />
      <el-table-column prop="attendCount" label="参与次数" align="center" />
      <el-table-column prop="correctRate" label="正确率" align="center" />
      <el-table-column prop="passRate" label="及格率" align="center" />
      <el-table-column prop="maxScore" label="最高分" align="center" />
      <el-table-column prop="minScore" label="最低分" align="center" />
      <el-table-column prop="avgScore" label="平均分" align="center" :formatter="avgScoreFormatter" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <router-link
            target="_blank"
            :to="{path:'/exam/student/detail',query: { id: row.id }}"
          >
            <el-button type="text" size="small">查看详细</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      align="center"
      :total="total"
      :page.sync="queryParam.page"
      :limit.sync="queryParam.limit"
      @pagination="getStatistics"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getClassList } from '@/api/classes'
import { getStatisticsStudent } from '@/api/analysis'
import { parseTime } from '@/utils'

export default {
  name: 'Statistics',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      allClasses: [],
      queryParam: {
        page: 1,
        limit: 10,
        classId: null
      },
      list: [],
      total: 0
    }
  },
  async created() {
    const _this = this
    await _this.getAllClassList()
    if (_this.allClasses.length > 0) {
      _this.queryParam.classId = _this.allClasses[0].id
      _this.getStatistics()
    }
  },
  methods: {
    async getAllClassList() {
      const _this = this
      await getClassList().then(re => {
        _this.allClasses = re.data
      })
    },
    getStatistics() {
      const _this = this
      getStatisticsStudent(_this.queryParam).then(re => {
        _this.list = re.data.list
        _this.total = re.data.total
        let order = (_this.queryParam.page - 1) * _this.queryParam.limit + 1
        for (let i = 0; i < _this.list.length; i++) {
          _this.list[i].order = order++
          if (_this.list[i].questionCount !== 0) {
            _this.list[i].correctRate = Math.round(_this.list[i].correctCount / _this.list[i].questionCount * 10000) / 100.00 + '%'
          } else {
            _this.list[i].correctRate = 0
          }
          if (_this.list[i].attendCount !== 0) {
            _this.list[i].passRate = Math.round(_this.list[i].passCount / _this.list[i].attendCount * 10000) / 100.00 + '%'
          } else {
            _this.list[i].passRate = 0
          }
        }
      })
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '帐户', '姓名', '应参与次数', '参与次数', '正确率', '及格率', '最高分', '最低分', '平均分']
        const filterVal = ['order', 'userName', 'realName', 'shouldAttendCount', 'attendCount', 'correctRate', 'passRate', 'maxScore', 'minScore', 'avgScore']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '考生情况统计',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    avgScoreFormatter(row, column, event) {
      return row.avgScore.toFixed(2)
    }
  }
}
</script>

<style scoped>

</style>
