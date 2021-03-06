import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function dashInfo() {
  return request({
    url: '/teacher/dash/info',
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    }
  })
}
