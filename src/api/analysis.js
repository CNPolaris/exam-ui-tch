import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getStudentResultPage(data) {
  return request({
    url: '/exam/analysis/student/list',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}
