<template>
  <div class="app-container">
    <el-row class="do-exam-title" style="background-color: #F5F5DC">
      <el-col :span="24">
        <span v-for="item in answer.answerItems" :key="item.itemOrder">
          <el-tag :type="questionDoRightTag(item.doRight)" class="do-exam-title-tag" @click="goAnchor('#question-'+item.itemOrder)">{{ item.itemOrder }}</el-tag>
        </span>
      </el-col>
    </el-row>
    <el-row class="do-exam-title-hidden">
      <el-col :span="24">
        <span v-for="item in answer.answerItems" :key="item.itemOrder">
          <el-tag class="do-exam-title-tag">{{ item.itemOrder }}</el-tag>
        </span>
      </el-col>
    </el-row>
    <el-container class="app-item-contain">
      <el-header class="align-center">
        <h1>{{ form.name }}</h1>
        <div>
          <span class="question-title-padding">试卷得分：{{ answer.score }}</span>
          <span class="question-title-padding">试卷耗时：{{ formatSeconds(answer.doTime) }}</span>
        </div>
      </el-header>
      <el-main>
        <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px">
          <el-row v-for="(titleItem,index) in form.titleItems" :key="index">
            <h3>{{ titleItem.name }}</h3>
            <el-card v-if="titleItem.questionItems.length!==0" class="exampaper-item-box">
              <el-form-item
                v-for="questionItem in titleItem.questionItems"
                :id="'question-'+ questionItem.itemOrder"
                :key="questionItem.itemOrder"
                :label="questionItem.itemOrder+'.'"
                class="exam-question-item"
                label-width="50px"
              >
                <el-row>
                  <QuestionAnswerShow :q-type="questionItem.questionType" :question="questionItem" :answer="answer.answerItems[questionItem.itemOrder-1]" />
                </el-row>
                <el-row v-if="answer.answerItems[questionItem.itemOrder-1].doRight === null">
                  <label style="color: #e6a23c">批改：</label>
                  <el-radio-group v-model="answer.answerItems[questionItem.itemOrder-1].score">
                    <el-radio v-for="item in scoreSelect(questionItem.score)" :key="item" :label="item">
                      {{ item }}
                    </el-radio>
                  </el-radio-group>
                </el-row>
              </el-form-item>
            </el-card>
          </el-row>
          <el-row class="do-align-center">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="$router.push('/exam/answer/record/list')">取消</el-button>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatSeconds } from '@/utils'
import QuestionAnswerShow from '@/views/exam/answer/components/QuestionAnswerShow'
import { teacherReadAnswer, editExamPaperAnswer } from '@/api/record'
export default {
  components: { QuestionAnswerShow },
  data() {
    return {
      form: {},
      formLoading: false,
      answer: {
        id: null,
        score: 0,
        doTime: 0,
        answerItems: [],
        doRight: false
      }
    }
  },
  created() {
    const id = this.$route.query.id
    const _this = this
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      teacherReadAnswer(id).then(re => {
        _this.form = re.data.paper
        _this.answer = re.data.answer
        _this.formLoading = false
      })
    }
  },
  methods: {
    submitForm() {
      const _this = this
      _this.formLoading = true
      editExamPaperAnswer(this.answer).then(re => {
        if (re.code === 2000) {
          _this.$alert('试卷得分：' + re.data + '分', '考试结果', {
            confirmButtonText: '返回考试记录',
            callback: action => {
              _this.$router.push('/exam/answer/record/list')
            }
          })
        } else {
          _this.$message.error(re.message)
        }
        _this.formLoading = false
      }).catch(e => {
        _this.formLoading = false
      })
    },
    scoreSelect(score) {
      const array = []
      for (let i = 0; i <= parseInt(score); i++) {
        array.push(i.toString())
      }
      if (score.indexOf('.') !== -1) {
        array.push(score)
      }
      return array
    },
    formatSeconds(theTime) {
      return formatSeconds(theTime)
    },
    questionDoRightTag(status) {
      return this.enumFormat(this.doRightTag, status)
    },
    goAnchor(selector) {
      this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      doRightTag: state => state.exam.question.answer.doRightTag
    })
  }
}
</script>

<style lang="scss" scoped>
.align-center {
  text-align: center
}

.exam-question-item{
  padding: 10px;
  .el-form-item__label{
    font-size: 15px !important;
  }
}

.question-title-padding{
  padding-left: 25px;
  padding-right: 25px;
}
</style>
