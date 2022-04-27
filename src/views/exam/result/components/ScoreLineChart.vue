<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import resize from '../../../dashboard/components/mixins/resize'
export default {
  name: "ScoreLineChart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    scoreLine: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    scoreLine: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.scoreLine)
    },
    setOptions(value) {
      this.chart.setOption({
        title: {
          text: '得分情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总分', '得分']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: value.createTime
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总分',
            type: 'line',
            stack: 'Total',
            data: value.paperScore
          },
          {
            name: '得分',
            type: 'line',
            stack: 'Total',
            data: value.userScore
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
