<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" />

      <el-table-column prop="name" align="center" label="名称" width="267" />

      <el-table-column prop="level" :formatter="levelFormatter" align="center" label="年级" width="353" />

      <el-table-column prop="subjectId" :formatter="subjectFormatter" align="center" label="学科" width="353" />

      <el-table-column prop="paperType" :formatter="examPaperTypeFormatter" align="center" label="试卷类型" width="397" />

      <el-table-column prop="createUser" align="center" label="创建者" width="353" />

      <el-table-column prop="createTime" :formatter="formatDateTime" align="center" label="创建时间" width="353" />
      <el-table-column label="操作">
        <el-button>成绩分析</el-button>
      </el-table-column>
    </el-table>
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
        subjectId: null
      },
      subjectFilter: null,
      allClasses: []
    }
  },
  async created() {
    const _this = this
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
  }
}
</script>

<style scoped>

</style>
