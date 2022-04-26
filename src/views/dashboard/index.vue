<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="tree" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              班级总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.classCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              学生总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.studentCount" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="doexampaper" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              试卷总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.examPaperCount" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="doquestion" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              题目总数
            </div>
            <count-to v-loading="loading" :start-val="0" :end-val="form.questionCount" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="echarts-class-pie" v-loading="loading" class="chart-wrapper" style="width: 100%;height:400px;" />
      </el-col>
      <el-col :span="12">
        <div id="echarts-paper-pie" v-loading="loading" class="chart-wrapper" style="width: 100%;height:400px;" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import resize from './components/mixins/resize'
import CountTo from 'vue-count-to'
import { dashInfo } from '@/api/dashboard'
import echarts from 'echarts'
export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  mixins: [resize],
  data() {
    return {
      loading: false,
      form: {
        examPaperCount: 0,
        questionCount: 0,
        classCount: 0,
        studentCount: 0,
        classPaperPie: [],
        classUserPie: []
      },
      echartsClassUserAction: null,
      echartsClassPaperAction: null
    }
  },
  mounted() {
    const _this = this
    _this.echartsClassUserAction = echarts.init(document.getElementById('echarts-class-pie'), 'macarons')
    _this.echartsClassPaperAction = echarts.init(document.getElementById('echarts-paper-pie'), 'macarons')
    _this.loading = true
    dashInfo().then(re => {
      _this.form.classCount = re.data.classCount
      _this.form.studentCount = re.data.studentCount
      _this.form.examPaperCount = re.data.examPaperCount
      _this.form.questionCount = re.data.questionCount
      _this.echartsClassUserAction.setOption(_this.pieOption('班级人数分布', re.data.classUserPie))
      _this.echartsClassPaperAction.setOption(_this.pieOption('班级试卷分布', re.data.classPaperPie))
      _this.loading = false
    })
  },
  methods: {
    pieOption(title, value) {
      return {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: value,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

