<template>
  <div class="app-container">
    <div ref="form">
      <header class="el-header align-center">
        <h1 align="center">{{ form.name }}</h1>
        <h5 align="center">建议时长:{{ form.suggestTime }}分钟 年级：{{ form.level|formatLevel }} 总分：{{ form.score }}</h5>
      </header>
      <main class="el-main">
        <el-form ref="form" :model="form">
          <el-form-item v-for="(titleItem, index) in form.titleItems" :key="index">
            <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
              <el-form-item
                v-for="(questionItem, questionIndex) in titleItem.questionItems"
                :key="questionIndex"
                :label="(questionIndex+1)+''"
                style="margin-bottom: 15px"
              >
                <el-row>
                  <el-col :span="23">
                    <QuestionShow :q-type="questionItem.questionType" :question="questionItem" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-card>
          </el-form-item>
        </el-form>
      </main>
    </div>
    <div align="center">
      <el-button type="primary" @click="handlePrint">打印</el-button>
      <el-button type="danger" @click="$router.push('/exam/list')">取消</el-button>
    </div>

  </div>
</template>

<script>
import { selectExamPaper } from '@/api/exam'
import QuestionShow from '../../question/components/Show'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  components: { QuestionShow },
  filters: {
    formatLevel(level) {
      switch (level) {
        case 1:
          return '一年级'
        case 2:
          return '二年级'
        case 3:
          return '三年级'
        case 4:
          return '四年级'
        case 5:
          return '五年级'
        case 6:
          return '六年级'
        case 7:
          return '初一'
        case 8:
          return '初二'
        case 9:
          return '初三'
        case 10:
          return '高一'
        case 11:
          return '高二'
        case 12:
          return '高三'
        default:
          return 0
      }
    }
  },
  data() {
    return {
      form: {
        id: null,
        level: null,
        subjectId: null,
        paperType: 1,
        limitDateTime: [],
        name: '',
        suggestTime: null,
        titleItems: []
      },
      subjectFilter: null
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      paperTypeEnum: state => state.exam.examPaper.paperTypeEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapState('exam', { subjects: state => state.subjects })
  },
  async created() {
    const id = this.$route.query.id
    const _this = this
    await this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      await selectExamPaper(id).then(re => {
        // _this.form = re.data
        Object.assign(_this.form, re.data)
      })
    }
  },
  methods: {
    handlePrint() {
      this.$print(this.$refs.form)
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  }
}
</script>

<style lang="scss">
.exampaper-item-box {
.q-title {
  margin: 0px 5px 0px 5px;
}
.q-item-content {
}
}
</style>
