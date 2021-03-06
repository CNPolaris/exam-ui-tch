<template>
  <div class="app-container">
    <el-form ref="form" v-loading="formLoading" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="年级：" prop="gradeLevel" required>
        <el-select v-model="form.gradeLevel" placeholder="年级" clearable @change="levelChange">
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学科：" prop="subjectId" required>
        <el-select v-model="form.subjectId" placeholder="学科">
          <el-option v-for="item in subjects" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="题干：" prop="title" required>
        <el-input v-model="form.title" type="textarea" />
      </el-form-item>
      <el-form-item label="选项：" required>
        <el-form-item v-for="(item,index) in form.items" :key="item.prefix" :label="item.prefix" label-width="50px" class="question-item-label">
          <el-input v-model="item.prefix" style="width:50px;" />
          <el-input v-model="item.content" class="question-item-content-input" type="textarea" />
          <el-button type="danger" size="mini" class="question-item-remove" icon="el-icon-delete" @click="questionItemRemove(index)" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="解析：" prop="analyze" required>
        <el-input v-model="form.analyze" type="textarea" />
      </el-form-item>
      <el-form-item label="分数：" prop="score" required>
        <el-input-number v-model="form.score" :precision="1" :step="1" :max="100" />
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate v-model="form.difficult" class="question-item-rate" />
      </el-form-item>
      <el-form-item label="正确答案：" prop="correct" required>
        <el-radio-group v-model="form.correct">
          <el-radio v-for="item in form.items" :key="item.prefix" :label="item.prefix">{{ item.prefix }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="questionItemAdd">添加选项</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="richEditor.dialogVisible" append-to-body :close-on-click-modal="false" style="width: 100%;height: 100%" :show-close="false" center>
      <Ueditor @ready="editorReady" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorConfirm">确 定</el-button>
        <el-button @click="richEditor.dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :q-type="questionShow.qType" :question="questionShow.question" :q-loading="questionShow.loading" />
    </el-dialog>
  </div>
</template>

<script>
import QuestionShow from '../components/Show'
import Ueditor from '@/components/Ueditor'
import { mapGetters, mapState, mapActions } from 'vuex'
import { selectQuestion, editQuestion } from '@/api/question'

export default {
  components: {
    Ueditor, QuestionShow
  },
  data() {
    return {
      form: {
        id: null,
        questionType: 1,
        gradeLevel: null,
        subjectId: null,
        title: '',
        items: [
          { prefix: 'A', content: '' },
          { prefix: 'B', content: '' },
          { prefix: 'C', content: '' },
          { prefix: 'D', content: '' }
        ],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      },
      subjectFilter: null,
      formLoading: false,
      rules: {
        gradeLevel: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        analyze: [
          { required: true, message: '请输入解析', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入分数', trigger: 'blur' }
        ],
        correct: [
          { required: true, message: '请选择正确答案', trigger: 'change' }
        ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapState('exam', { subjects: state => state.subjects })
  },
  created() {
    const id = this.$route.query.id
    const _this = this
    this.initSubject(function() {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      selectQuestion(id).then(re => {
        _this.form = re.data
        _this.formLoading = false
      })
    }
  },
  methods: {
    editorReady(instance) {
      this.richEditor.instance = instance
      const currentContent = this.richEditor.object[this.richEditor.parameterName]
      this.richEditor.instance.setContent(currentContent)
      // 光标定位到Ueditor
      this.richEditor.instance.focus(true)
    },
    inputClick(object, parameterName) {
      this.richEditor.object = object
      this.richEditor.parameterName = parameterName
      this.richEditor.dialogVisible = true
    },
    editorConfirm() {
      const content = this.richEditor.instance.getContent()
      this.richEditor.object[this.richEditor.parameterName] = content
      this.richEditor.dialogVisible = false
    },
    questionItemRemove(index) {
      this.form.items.splice(index, 1)
    },
    questionItemAdd() {
      const items = this.form.items
      let newLastPrefix
      if (items.length > 0) {
        const last = items[items.length - 1]
        newLastPrefix = String.fromCharCode(last.prefix.charCodeAt() + 1)
      } else {
        newLastPrefix = 'A'
      }
      items.push({ id: null, prefix: newLastPrefix, content: '' })
    },
    submitForm() {
      const _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          editQuestion(this.form).then(re => {
            _this.delCurrentView(_this).then(() => {
              _this.$router.push('/question/list')
            })
            this.formLoading = false
          })
          // if (this.$route.query.isUpdate === 1) {
          //   updateQuestion(this.form).then(re => {
          //     if (re.code === 2000) {
          //       _this.$notify({
          //         title: '成功',
          //         message: re.message,
          //         type: 'success',
          //         duration: 2000
          //       })
          //       // _this.$router.push('/question/list')
          //       _this.delCurrentView(_this).then(() => {
          //         _this.$router.push('/question/list')
          //       })
          //     } else {
          //       _this.$notify({
          //         title: '失败',
          //         message: re.message,
          //         type: 'error',
          //         duration: 1000
          //       })
          //       this.formLoading = false
          //     }
          //   }).catch(e => {
          //     this.formLoading = false
          //   })
          // } else {
          //   createQuestion(this.form).then(re => {
          //     if (re.code === 2000) {
          //       _this.$notify({
          //         title: '成功',
          //         message: re.message,
          //         type: 'success',
          //         duration: 2000
          //       })
          //       // _this.$router.push('/question/list')
          //       _this.delCurrentView(_this).then(() => {
          //         _this.$router.push('/question/list')
          //       })
          //     } else {
          //       _this.$notify({
          //         title: '失败',
          //         message: re.message,
          //         type: 'error',
          //         duration: 1000
          //       })
          //       this.formLoading = false
          //     }
          //   }).catch(e => {
          //     this.formLoading = false
          //   })
          // }
        } else {
          return false
        }
      })
    },
    resetForm() {
      const lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        questionType: 1,
        gradeLevel: null,
        subjectId: null,
        title: '',
        items: [
          { prefix: 'A', content: '' },
          { prefix: 'B', content: '' },
          { prefix: 'C', content: '' },
          { prefix: 'D', content: '' }
        ],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      }
      this.form.id = lastId
    },
    levelChange() {
      this.form.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.form.gradeLevel)
    },
    showQuestion() {
      this.questionShow.dialog = true
      this.questionShow.qType = this.form.questionType
      this.questionShow.question = this.form
    },
    ...mapActions('exam', { initSubject: 'initSubject' }),
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  }
}
</script>
