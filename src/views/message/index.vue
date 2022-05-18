<template>
  <div class="message-container">
    <el-collapse v-for="(item, index) in list" :key="index" @change="handleRead(item)">
      <el-collapse-item>
        <template slot="title">
          {{ item.title }}
          <el-tag :type="statusTagFormatter(item.readed)">
            {{ statusFormatter(item.readed) }}
          </el-tag>
        </template>
        <div>发送人：{{ item.sendUserName }}</div>
        <div>内容：{{ item.content }}</div>
        <div>发送时间：{{ item.createTime|formatDateTime }}</div>
      </el-collapse-item>
    </el-collapse>
    <pagination v-show="total>0" :total="total" :page.sync="queryParam.page" :limit.sync="queryParam.limit" style="text-align: center" @pagination="getMessage" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getMessageList, readMessage } from '@/api/message'
import { formatDate } from '@/utils/date'

export default {
  name: 'MessageIndex',
  components: { Pagination },
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
      list: [],
      total: 0,
      queryParam: {
        page: 1,
        limit: 15,
        sendUser: null
      }
    }
  },
  created() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      const _this = this
      getMessageList(this.queryParam).then(re => {
        _this.list = re.data.list
        _this.total = re.data.total
      })
    },
    handleRead(item) {
      if (item.readed === false) {
        readMessage(item.id).then(re => {
          if (re.code === 2000) {
            this.$message({
              message: re.message,
              type: 'success'
            })
          }
          this.getMessage()
        })
      }
    },
    statusTagFormatter(status) {
      if (status) {
        return 'success'
      } else {
        return 'warning'
      }
    },
    statusFormatter(status) {
      if (status) {
        return '已读'
      } else {
        return '未读'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  padding: 32px;
  background-color: #fdfaf3;
}
</style>
