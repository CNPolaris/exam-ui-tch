import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getReceiveMessageList(query) {
  return request({
    url: '/teacher/message/send/history',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function sendMessage(query) {
  return request({
    url: '/teacher/message/send',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}
