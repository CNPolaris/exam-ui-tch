<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParam" :inline="true">
        <el-form-item label="试卷ID：">
          <el-input v-model="queryParam.id" style="width: 100px" />
        </el-form-item>
        <el-form-item label="年级" prop="level">
          <el-select v-model="queryParam.level" placeholder="年级" clearable style="width: 100px">
            <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="queryParam.classId" placeholder="班级" style="width: 100px">
            <el-option v-for="item in allClasses" :key="item.id" value="item.id" :label="item.className" />
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model="queryParam.subjectId" placeholder="学科" style="width: 100px">
            <el-option v-for="item in subjects" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" />

      <el-table-column prop="name" align="center" label="名称" width="260" />

      <el-table-column prop="gradeLevel" :formatter="levelFormatter" align="center" label="年级" width="210" />

      <el-table-column prop="subjectId" :formatter="subjectFormatter" align="center" label="学科" width="210" />

      <el-table-column prop="paperType" :formatter="examPaperTypeFormatter" align="center" label="试卷类型" width="220" />

      <el-table-column prop="createUser" align="center" label="创建者" width="230" />

      <el-table-column prop="createTime" :formatter="formatDateTime" align="center" label="创建时间" width="250" />
      <el-table-column label="操作" width="208">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="$router.push({ path: '/exam/result/analyze', query: { id: row.id }})">成绩分析</el-button>
          <el-button type="success" size="mini" @click="$router.push({ path:'/exam/detail', query:{ id:row.id }})">查看原卷</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParam.page" :limit.sync="queryParam.limit" style="text-align: center" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { formatDate } from '@/utils/date'
import { getResultPaper } from '@/api/exam'
import { getClassList } from '@/api/classes'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ResultIndex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      queryParam: {
        id: null,
        page: 1,
        limit: 10,
        level: null,
        subjectId: null,
        classId: null
      },
      subjectFilter: null,
      allClasses: []
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      paperTypeEnum: state => state.exam.examPaper.paperTypeEnum,
      levelEnum: state => state.user.levelEnum,
      examPaperTypeEnum: state => state.exam.examPaper.paperTypeEnum
    }),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', { subjects: state => state.subjects })
  },
  async created() {
    const _this = this
    this.queryParam.classId = this.$route.query.id
    await this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    await getClassList().then(re => {
      _this.allClasses = re.data
    })
    await this.getList()
  },
  methods: {
    getList() {
      getResultPaper(this.queryParam).then(re => {
        this.total = re.data.total
        this.list = re.data.list
      })
    },
    subjectFormatter(row, column, cellValue, index) {
      return this.subjectEnumFormat(cellValue)
    },
    levelFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
    examPaperTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.examPaperTypeEnum, cellValue)
    },
    formatDateTime(row, column, cellValue, index) {
      if (row.createTime === null || row.createTime === '') {
        return 'N/A'
      }
      const date = new Date(row.createTime)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  }
}
</script>

<style scoped>

</style>
