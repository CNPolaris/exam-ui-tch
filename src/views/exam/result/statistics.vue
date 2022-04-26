<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="选择班级：">
        <el-select v-model="queryParam.classId">
          <el-option v-for="item in allClasses" :key="item.id" :value="item.id" :label="item.className"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column prop="userName" label="帐户"/>
      <el-table-column prop="realName" label="姓名"/>
      <el-table-column prop="shouldAttendCount" label="应参与次数"/>
      <el-table-column prop="attendCount" label="参与次数"/>
      <el-table-column prop="attendRate" label="参与率"/>
      <el-table-column prop="correctRate" label="正确率"/>
      <el-table-column pro="maxScore" label="最高分"/>
      <el-table-column prop="minScore" label="最低分"/>
      <el-table-column prop="avgScore" label="平均分"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParam.page"
      :limit.sync="queryParam.limit"
      @pagination="getStatistics"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {getClassList} from '@/api/classes'
import {getStatisticsStudent} from '@/api/analysis'

export default {
  name: 'statistics',
  directives: {waves},
  components: {Pagination},
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
        for (let i = 0; i < _this.list.length; i++) {
          if (_this.list[i].questionCount !== 0) {
            _this.list[i].correctRate = Math.round(_this.list[i].correctCount / _this.list[i].questionCount * 10000) / 100.00 + '%'
          } else {
            _this.list[i].correctRate = 0
          }
          if (_this.list[i].shouldAttendCount !== 0) {
            _this.list[i].attendRate = Math.round(_this.list[i].attendCount / _this.list[i].shouldAttendCount * 10000) / 100.00 + '%'
          } else {
            _this.list[i].attendRate = 0
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
